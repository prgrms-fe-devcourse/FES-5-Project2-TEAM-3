interface Routes {
  path: string;
  label: string;
  hidden?: boolean;
}

const routes:Routes[] = [
  { path: '/', label: 'Home' },
  // { path: '/review', label: 'Review' },
  { path: '/members', label: 'Members' },
  { path: '/login', label: '', hidden: true },
  { path: '/register', label: '', hidden: true },
]

export default routes;