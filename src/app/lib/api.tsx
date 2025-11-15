import { redirect } from "next/navigation";

export const fetchUser = async (url: string) => {
    const res = await fetch(`${url}/auth/me`, { credentials: 'include' });
    if (!res.ok) redirect("/auth/login");;
    return res.json();
};


export const login = async (email: string, password: string, url: string) => {
    const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Credenciales incorrectas');
    return res;
};

export const logout = async (url: string) => {
    const res = await fetch(`${url}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al cerrar sesión');
    return res;
};

export async function register(username: string, email: string, password: string, url: string, invitation_token?: string | null) {
    try {
        const body: { username: string; email: string; password: string } = { username, email, password };
        const queryParams = invitation_token ? `?invitation_token=${invitation_token}` : '';
        
        const res = await fetch(`${url}/auth/register${queryParams}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        return res.json();
    } catch (error) {
        console.error("Error en el registro:", error);
        return false;
    }
}

export async function forgot_password(url: string, email: string){
    const res = await fetch(`${url}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error('Error al enviar el correo');
    return res;
}

export async function reset_password(url: string, new_password: string, token: string){
    const res = await fetch(`${url}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password }),
    });

    if (!res.ok) throw new Error('Error al resetear la contraseña');
    return res;
}

// Workspaces
export async function createWorkspace(url: string, name: string, monthly_budget?: number) {
    const res = await fetch(`${url}/workspaces/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ name, monthly_budget }),
    });
    if (!res.ok) throw new Error('Error al crear workspace');
    return res.json();
}

export async function updateWorkspace(url: string, workspaceId: number, data: { name?: string; monthly_budget?: number }) {
    const res = await fetch(`${url}/workspaces/${workspaceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar workspace');
    return res.json();
}

export async function getWorkspaceMembers(url: string, workspaceId: number) {
    const res = await fetch(`${url}/workspaces/${workspaceId}/members/`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al obtener miembros');
    return res.json();
}

export async function addWorkspaceMember(url: string, workspaceId: number, email: string, role: string = "member") {
    const res = await fetch(`${url}/workspaces/${workspaceId}/members/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ email, role }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Error al agregar miembro');
    }
    return res.json();
}

export async function removeWorkspaceMember(url: string, workspaceId: number, userId: number) {
    const res = await fetch(`${url}/workspaces/${workspaceId}/members/${userId}`, {
        method: "DELETE",
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al eliminar miembro');
    return res.json();
}

// Categories
export async function createCategory(url: string, name: string, workspace_id: number) {
    const res = await fetch(`${url}/categories/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ name, workspace_id }),
    });
    if (!res.ok) throw new Error('Error al crear categoría');
    return res.json();
}

export async function deleteCategory(url: string, categoryId: number) {
    const res = await fetch(`${url}/categories/${categoryId}`, {
        method: "DELETE",
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al eliminar categoría');
    return res.json();
}

// Transactions
export async function createTransaction(url: string, data: unknown) {
    const res = await fetch(`${url}/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear transacción');
    return res.json();
}

export async function deleteTransaction(url: string, transactionId: number) {
    const res = await fetch(`${url}/transactions/${transactionId}`, {
        method: "DELETE",
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al eliminar transacción');
    return res.json();
}

// Recurring Transactions
export async function getRecurringTransactions(url: string, workspaceId: number) {
    const res = await fetch(`${url}/recurring/?workspace_id=${workspaceId}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al obtener gastos recurrentes');
    return res.json();
}

export async function createRecurringTransaction(url: string, data: {
    name: string;
    amount: number;
    description?: string;
    day_of_month: number;
    workspace_id: number;
    category_id?: number | null;
}) {
    const res = await fetch(`${url}/recurring/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear gasto recurrente');
    return res.json();
}

export async function toggleRecurringTransaction(url: string, recurringId: number) {
    const res = await fetch(`${url}/recurring/${recurringId}/toggle`, {
        method: "PATCH",
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al cambiar estado');
    return res.json();
}

export async function deleteRecurringTransaction(url: string, recurringId: number) {
    const res = await fetch(`${url}/recurring/${recurringId}`, {
        method: "DELETE",
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al eliminar gasto recurrente');
    return res.json();
}

export async function generateRecurringForMonth(url: string, workspaceId: number) {
    const res = await fetch(`${url}/recurring/generate-month?workspace_id=${workspaceId}`, {
        method: "POST",
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al generar transacciones');
    return res.json();
}

export async function generateSingleRecurring(url: string, recurringId: number) {
    const res = await fetch(`${url}/recurring/generate-one/${recurringId}`, {
        method: "POST",
        credentials: 'include',
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Error al generar transacción');
    }
    return res.json();
}

export async function getRecurringStatus(url: string, workspaceId: number) {
    const res = await fetch(`${url}/recurring/status?workspace_id=${workspaceId}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al obtener estado');
    return res.json();
}

// Export
export async function exportTransactionsCSV(url: string, workspaceId: number, startDate?: string, endDate?: string) {
    let endpoint = `${url}/transactions/export?workspace_id=${workspaceId}`;
    if (startDate) endpoint += `&start_date=${startDate}`;
    if (endDate) endpoint += `&end_date=${endDate}`;
    
    const res = await fetch(endpoint, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al exportar datos');
    
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `transacciones_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
}

// Reports
export async function getReportSummary(url: string, workspaceId: number, startDate?: string, endDate?: string) {
    let endpoint = `${url}/reports/summary?workspace_id=${workspaceId}`;
    if (startDate) endpoint += `&start_date=${startDate}`;
    if (endDate) endpoint += `&end_date=${endDate}`;
    
    const res = await fetch(endpoint, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener resumen');
    return res.json();
}

export async function getMonthlyTrend(url: string, workspaceId: number, months: number = 6) {
    const res = await fetch(`${url}/reports/monthly-trend?workspace_id=${workspaceId}&months=${months}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al obtener tendencia');
    return res.json();
}
