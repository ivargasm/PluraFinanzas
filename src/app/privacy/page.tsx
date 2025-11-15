'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="text-primary hover:underline mb-6 inline-block">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Aviso de Privacidad</h1>
        <p className="text-muted-foreground mb-8">Última actualización: Enero 2025</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introducción</h2>
            <p>En PluraFinanzas valoramos y respetamos tu privacidad. Este Aviso describe cómo recopilamos, usamos y protegemos tu información personal.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Información que Recopilamos</h2>
            <h3 className="text-xl font-semibold mb-2">Datos de Registro:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nombre de usuario</li>
              <li>Correo electrónico</li>
              <li>Contraseña (encriptada)</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 mt-4">Datos Financieros:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Transacciones y gastos</li>
              <li>Categorías personalizadas</li>
              <li>Presupuestos mensuales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. NO Vendemos tus Datos</h2>
            <p className="font-semibold text-lg">Nunca vendemos tu información personal con terceros para fines de marketing.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Seguridad</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>🔒 Contraseñas encriptadas</li>
              <li>🔒 Comunicación HTTPS</li>
              <li>🔒 Protección contra ataques</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Tus Derechos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>✅ Acceder a tu información</li>
              <li>✅ Exportar tus datos (CSV)</li>
              <li>✅ Eliminar tu cuenta</li>
            </ul>
          </section>

          <section className="bg-primary/10 p-6 rounded-lg">
            <p className="font-semibold text-center">Al usar PluraFinanzas, aceptas este Aviso de Privacidad.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
