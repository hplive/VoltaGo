import { redirect } from 'next/navigation'

// Redireciona sempre para /login
// A protecção de rotas está nos layouts (server components)
export default function Home() {
  redirect('/login')
}
