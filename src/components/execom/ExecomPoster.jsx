import React from 'react';

function SocialIcon({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-gray-700 hover:text-white hover:bg-indigo-600 transition-colors border border-gray-200"
    >
      {children}
    </a>
  );
}

export default function ExecomPoster({ members }) {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-2">👥</div>
        <p className="text-gray-600">No Execom members to display.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {members.map((m) => (
        <div
          key={m.id}
          className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-56 bg-gray-100 overflow-hidden">
            {m.image_url ? (
              <img
                src={m.image_url}
                alt={m.full_name || 'Execom Member'}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.src = 'https://dummyimage.com/640x480/e5e7eb/9ca3af&text=Member'; }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-6xl text-gray-400">👤</div>
            )}
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900">
              {m.full_name || 'Unnamed Member'}
            </h3>
            <p className="text-indigo-700 font-medium">{m.position?.replace(/_/g, ' ') || 'Member'}</p>
            {m.department ? (
              <p className="mt-1 text-sm text-gray-500">{m.department}{m.year ? ` • ${m.year}` : ''}</p>
            ) : null}
            {m.bio ? (
              <p className="mt-3 text-sm text-gray-600 line-clamp-3">{m.bio}</p>
            ) : null}
            <div className="mt-4 flex items-center gap-3">
              <SocialIcon href={m.linkedin} label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.027-3.059-1.864-3.059-1.867 0-2.154 1.458-2.154 2.966v5.697h-3v-10h2.881v1.367h.041c.401-.761 1.377-1.563 2.835-1.563 3.033 0 3.594 1.997 3.594 4.594v5.602z"/></svg>
              </SocialIcon>
              <SocialIcon href={m.instagram} label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.206.056 2.003.24 2.466.403a4.92 4.92 0 0 1 1.78 1.153 4.92 4.92 0 0 1 1.153 1.78c.163.463.347 1.26.403 2.466.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.206-.24 2.003-.403 2.466a4.92 4.92 0 0 1-1.153 1.78 4.92 4.92 0 0 1-1.78 1.153c-.463.163-1.26.347-2.466.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.206-.056-2.003-.24-2.466-.403a4.92 4.92 0 0 1-1.78-1.153 4.92 4.92 0 0 1-1.153-1.78c-.163-.463-.347-1.26-.403-2.466C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.056-1.206.24-2.003.403-2.466a4.92 4.92 0 0 1 1.153-1.78 4.92 4.92 0 0 1 1.78-1.153c.463-.163 1.26-.347 2.466-.403C8.416 2.175 8.796 2.163 12 2.163zm0 1.622c-3.155 0-3.526.012-4.768.069-.991.046-1.527.21-1.882.349-.474.184-.81.403-1.166.759-.356.356-.575.692-.759 1.166-.139.355-.303.891-.349 1.882-.057 1.242-.069 1.613-.069 4.768s.012 3.526.069 4.768c.046.991.21 1.527.349 1.882.184.474.403.81.759 1.166.356.356.692.575 1.166.759.355.139.891.303 1.882.349 1.242.057 1.613.069 4.768.069s3.526-.012 4.768-.069c.991-.046 1.527-.21 1.882-.349.474-.184.81-.403 1.166-.759.356-.356.575-.692.759-1.166.139-.355.303-.891.349-1.882.057-1.242.069-1.613.069-4.768s-.012-3.526-.069-4.768c-.046-.991-.21-1.527-.349-1.882-.184-.474-.403-.81-.759-1.166-.356-.356-.692-.575-1.166-.759-.355-.139-.891-.303-1.882-.349-1.242-.057-1.613-.069-4.768-.069zm0 2.838a5.377 5.377 0 1 1 0 10.754 5.377 5.377 0 0 1 0-10.754zm0 1.8a3.578 3.578 0 1 0 0 7.156 3.578 3.578 0 0 0 0-7.156zm4.926-2.284a1.253 1.253 0 1 0 0 2.506 1.253 1.253 0 0 0 0-2.506z"/></svg>
              </SocialIcon>
              <SocialIcon href={m.github} label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 .5C5.73.5.77 5.46.77 11.73c0 4.92 3.19 9.09 7.62 10.57.56.1.76-.24.76-.54 0-.27-.01-1.15-.02-2.09-3.1.67-3.75-1.32-3.75-1.32-.51-1.29-1.25-1.63-1.25-1.63-1.02-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76-.54 1.77-1.35.9-.65 2.04-.47 2.55-.36.09-.73.35-1.24.64-1.53-2.47-.28-5.06-1.24-5.06-5.52 0-1.22.43-2.22 1.14-3-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.15a10.53 10.53 0 0 1 5.56 0c2.12-1.45 3.05-1.15 3.05-1.15.6 1.53.22 2.66.11 2.94.71.78 1.14 1.78 1.14 3 0 4.29-2.6 5.24-5.07 5.51.36.31.69.92.69 1.86 0 1.35-.01 2.43-.01 2.76 0 .3.2.65.77.54A10.22 10.22 0 0 0 23.23 11.73C23.23 5.46 18.27.5 12 .5z"/></svg>
              </SocialIcon>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
