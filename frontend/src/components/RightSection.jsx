import React from 'react';
import UserDetails from './UserDetails';
import QuestionPalette from './QuestionPalette';
import SubmitButton from './SubmitButton';

export default function RightSection({ user }) {
  return (
    <div className="hidden lg:flex lg:flex-col bg-white h-full">
      <UserDetails user={user} />
      <QuestionPalette />
      <SubmitButton />
    </div>
  );
}
