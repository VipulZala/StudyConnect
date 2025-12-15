
import { useEffect, useState } from 'react';
import { initSocket, getSocket } from '../lib/socket';
import { apiFetch } from '../lib/api';

export default function Chat({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const history = await apiFetch(`/messages/conversation?chatId=${chatId}`);
        setMessages(history || []);
      } catch (err) {
        console.warn('history err', err);
      }
    })();

    const s = initSocket();
    s.emit('joinChat', chatId);
    s.on('newMessage', (msg: any) => setMessages((m) => [...m, msg]));
    return () => {
      s.off('newMessage');
    };
  }, [chatId]);

  const send = () => {
    const s = getSocket();
    s.emit('sendMessage', { chatId, content: text, receivers: [] });
    setText('');
  };

  return (
    <div className="container py-3">
      <div className="card">
        <div className="card-body">
          <div className="bg-body-secondary" style={{ height: 300, overflow: 'auto', border: '1px solid var(--bs-border-color)', padding: 8, borderRadius: '0.375rem', marginBottom: '1rem' }}>
            {messages.map((m) => <div key={m._id || Math.random()} className="mb-1"><b>{m.sender}</b>: {m.content}</div>)}
          </div>
          <div className="d-flex gap-2">
            <input value={text} onChange={e => setText(e.target.value)} className="form-control" placeholder="Type a message..." />
            <button onClick={send} className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
