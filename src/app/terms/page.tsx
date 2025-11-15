'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="text-primary hover:underline mb-6 inline-block">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Términos y Condiciones</h1>
        <p className="text-muted-foreground mb-8">Última actualización: Enero 2025</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
            <p>Al acceder y usar PluraFinanzas, aceptas estos Términos y Condiciones. Si no estás de acuerdo, no uses la plataforma.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Descripción del Servicio</h2>
            <p>PluraFinanzas es una plataforma de gestión de finanzas colaborativas que permite:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Registrar y categorizar gastos</li>
              <li>Crear workspaces compartidos</li>
              <li>Generar reportes financieros</li>
              <li>Integración opcional con Telegram</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Registro y Cuenta</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Debes proporcionar información veraz y actualizada</li>
              <li>Eres responsable de mantener la confidencialidad de tu contraseña</li>
              <li>Debes tener al menos 18 años para usar el servicio</li>
              <li>Una persona puede tener solo una cuenta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Uso Aceptable</h2>
            <h3 className="text-xl font-semibold mb-2 text-green-600">Está Permitido:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usar la plataforma para gestión financiera personal o familiar</li>
              <li>Compartir workspaces con personas de confianza</li>
              <li>Exportar tus propios datos</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 mt-4 text-red-600">Está Prohibido:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usar la plataforma para actividades ilegales</li>
              <li>Intentar acceder a cuentas de otros usuarios</li>
              <li>Realizar ingeniería inversa del código</li>
              <li>Sobrecargar los servidores intencionalmente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Workspaces Colaborativos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>El creador de un workspace es el "owner"</li>
              <li>Los owners pueden invitar, remover miembros y eliminar el workspace</li>
              <li>Al unirte a un workspace, otros miembros verán tus transacciones en ese espacio</li>
              <li>Si eliminas un workspace, se eliminan todos sus datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Limitación de Responsabilidad</h2>
            <p>PluraFinanzas se proporciona "tal cual". No garantizamos:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Disponibilidad ininterrumpida del servicio</li>
              <li>Ausencia total de errores</li>
              <li>Resultados específicos en tu gestión financiera</li>
            </ul>
            <p className="mt-4">No somos responsables por decisiones financieras basadas en la información de la plataforma.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Terminación</h2>
            <p>Podemos suspender o terminar tu cuenta si violas estos términos o realizas actividades fraudulentas.</p>
            <p className="mt-2">Puedes eliminar tu cuenta en cualquier momento desde la configuración.</p>
          </section>

          <section className="bg-primary/10 p-6 rounded-lg">
            <p className="font-semibold text-center">Al usar PluraFinanzas, aceptas estos Términos y Condiciones.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
