import { ReactNode } from 'react';

export const Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <aside
      style={{
        display: 'block',
        width: 250,
        height: '100vh',
        borderRight: '2px solid',
        borderColor: '#242424',
        paddingTop: 3,
      }}
    >
      {children}
    </aside>
  );
};

export default Sidebar;
