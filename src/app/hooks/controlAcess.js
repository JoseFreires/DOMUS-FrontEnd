export const checkAccess = (roles = []) => {
    return {
        adminOnly: roles.includes("ROLE_ADMIN"),
        sindicoView: roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SINDICO"),
        porteiroView: roles.includes("ROLE_PORTEIRO") || roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SINDICO"),
        moradorView: roles.includes("ROLE_MORADOR")
    };
};