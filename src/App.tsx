import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from './components/Calendar';
import { Editor } from './components/Editor';
import { SearchBar } from './components/SearchBar';
import { Book, StickyNote } from 'lucide-react';
import type { JournalEntry, Note } from './types';
import { supabase, uploadImage } from './utils/supabase';

function App() {
  const [activeTab, setActiveTab] = useState<'journal' | 'notes'>('journal');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const entriesMap = entries.reduce((acc, entry) => {
    acc[format(new Date(entry.created_at), 'yyyy-MM-dd')] = true;
    return acc;
  }, {} as Record<string, boolean>);

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentEntry = entries.find(entry =>
    format(new Date(entry.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleSaveEntry = async (content: string, title: string, images: string[]) => {
    const user = supabase.auth.getUser();
    if (!user) return;

    if (currentEntry) {
      const { error } = await supabase
        .from('journal_entries')
        .update({ content, title, images, updated_at: new Date().toISOString() })
        .eq('id', currentEntry.id);

      if (!error) {
        setEntries(entries.map(entry =>
          entry.id === currentEntry.id
            ? { ...entry, content, title, images, updated_at: new Date().toISOString() }
            : entry
        ));
      }
    } else {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          content,
          title,
          images,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (!error && data) {
        setEntries([...entries, data[0]]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif text-blue-900">Personal Journal</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === 'journal' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Book className="w-5 h-5" />
              Journal
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === 'notes' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <StickyNote className="w-5 h-5" />
              Notes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              entriesMap={entriesMap}
            />
          </div>

          <div className="col-span-8 space-y-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {activeTab === 'journal' ? (
              <Editor
                initialContent={currentEntry?.content || ''}
                initialTitle={currentEntry?.title || ''}
                initialImages={currentEntry?.images || []}
                onSave={handleSaveEntry}
                onUpload={uploadImage}
                placeholder="Write your journal entry here..."
                date={selectedDate}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Notes</h2>
                <Editor
                  initialContent=""
                  onSave={(content, title) => {
                    console.log('Saving note:', { content, title });
                  }}
                  onUpload={uploadImage}
                  placeholder="Write a quick note..."
                  date={new Date()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;