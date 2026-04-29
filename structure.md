weboost-nic/
├── app/ # Rutas y Server Components
│ ├── (auth)/ # Grupo de rutas para login/registro
│ ├── (dashboard)/ # Grupo de rutas para la plataforma principal
│ │ ├── layout.tsx # Sidebar y Nav compartido
│ │ └── page.tsx # Tu Dashboard WF-02
├── components/ # Componentes UI reutilizables
│ ├── ui/ # Componentes de Shadcn
│ └── dashboard/ # Componentes específicos (KPI Cards, etc.)
├── lib/ # Lógica compartida (Supabase, Utils)
├── store/ # Estado global (Zustand)
├── pnpm-lock.yaml # EL archivo de bloqueo de pnpm (No borrar)
└── .env.local # Variables de entorno de Supabase
