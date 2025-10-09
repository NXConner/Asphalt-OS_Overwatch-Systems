"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiPost } from '@/lib/api-client';
import { isEnabled } from '@/lib/flags';
import { toast } from 'sonner';

export function EmailSender() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Hello from Asphalt OS');
  const [text, setText] = useState('This is a test email.');
  const disabled = !isEnabled('email_notifications');

  const send = async () => {
    try {
      const res = await apiPost('/api/email', { to, subject, text });
      toast.success('Email queued', { description: JSON.stringify(res) });
    } catch (e: any) {
      toast.error(e.message || 'Failed to send');
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Email Sender</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {disabled && <div className="text-sm text-muted-foreground">Feature disabled by flag.</div>}
        <div>
          <Label>To</Label>
          <Input value={to} onChange={e => setTo(e.target.value)} placeholder="user@example.com" />
        </div>
        <div>
          <Label>Subject</Label>
          <Input value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
        <div>
          <Label>Body</Label>
          <Input value={text} onChange={e => setText(e.target.value)} />
        </div>
        <Button onClick={send} disabled={disabled || !to}>Send Email</Button>
      </CardContent>
    </Card>
  );
}
