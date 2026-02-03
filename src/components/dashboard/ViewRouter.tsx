import { ReactNode } from 'react';

interface ViewConfig {
  id: string;
  component: ReactNode;
}

interface ViewRouterProps {
  currentView: string;
  views: ViewConfig[];
  fallback?: ReactNode;
  className?: string;
}

export function ViewRouter({
  currentView,
  views,
  fallback = <div>View not found</div>,
  className = '',
}: ViewRouterProps) {
  const activeView = views.find((view) => view.id === currentView);

  return (
    <div className={className}>
      {activeView ? activeView.component : fallback}
    </div>
  );
}