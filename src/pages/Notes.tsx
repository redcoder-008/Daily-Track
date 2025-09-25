import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, FileText, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { db, offlineUtils, OfflineNote } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, [user]);

  const loadNotes = async () => {
    try {
      if (user) {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('updated_at', { ascending: false });

        if (!error && data) {
          setNotes(data);
        } else {
          // Fallback to local storage
          const localNotes = await db.notes.orderBy('updated_at').reverse().toArray();
          setNotes(localNotes.map(note => ({
            id: note.id?.toString() || '',
            title: note.title,
            content: note.content,
            created_at: note.created_at,
            updated_at: note.updated_at
          })));
        }
      } else {
        // Load from local storage for offline mode
        const localNotes = await db.notes.orderBy('updated_at').reverse().toArray();
        setNotes(localNotes.map(note => ({
          id: note.id?.toString() || '',
          title: note.title,
          content: note.content,
          created_at: note.created_at,
          updated_at: note.updated_at
        })));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note title",
        variant: "destructive",
      });
      return;
    }

    try {
      const noteData = {
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user?.id,
      };

      if (user && navigator.onLine) {
        // Save to Supabase
        const { data, error } = await supabase
          .from('notes')
          .insert(noteData)
          .select()
          .single();

        if (error) throw error;
        
        // Also save to local storage as backup
        await db.notes.add({ ...noteData, synced: true });
        
        if (data) {
          setNotes(prev => [data, ...prev]);
        }
      } else {
        // Save to local storage only
        await offlineUtils.saveWithOfflineSupport(
          db.notes,
          noteData as Omit<OfflineNote, 'id' | 'synced'>,
          async () => {
            if (user) {
              await supabase.from('notes').insert(noteData);
            }
          }
        );
        
        loadNotes(); // Reload to get the new note with ID
      }

      setNewNote({ title: "", content: "" });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      if (user && navigator.onLine) {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', noteId);

        if (error) throw error;
      }
      
      // Also delete from local storage
      await db.notes.where('id').equals(parseInt(noteId)).delete();
      
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quick Notes</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter note content..."
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                />
              </div>
              <Button onClick={handleAddNote} className="w-full">
                Add Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search notes..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredNotes.length > 0 ? (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {note.title}
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteNote(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {note.content && (
                  <p className="text-muted-foreground mb-2 line-clamp-3">{note.content}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(note.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Recent Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {searchTerm ? "No notes found matching your search." : "No notes yet. Tap + to create your first note!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notes;