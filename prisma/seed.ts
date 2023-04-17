// import { CreateContext } from "../src/context";
// import { PrismaClient, Group, Permission, } from "./.prisma/prismaclient";
// const ctx = CreateContext();
// /**Creation of groups, should return a list of names and ids */
// async function createGroups(): Promise<Group[]> {
//     const toCreateGroups = [
//         { name: "SysAdm" },
//         { name: "Op. Estoque" },
//         { name: "Gestor" },
//         { name: "Vendedor" },
//     ]
//     return await ctx.prisma.$transaction(
//         toCreateGroups.map((group) => ctx.prisma.group.create({ data: group })),
//     );
// }

// /**Creation of groups, should return a list of names and ids */
// async function createPermissions(): Promise<Permission[]> {
//     const createPermFactory = (name: string, description: string, id: number) => ({ name, description, id })
//     const toCreatePerms = [
//         createPermFactory("Gerenciar grupos", "Permite renomear ou desativar o grupo", 10),
//         createPermFactory("Acessar sistema", "Permite acesso ao sistema", 1),
//         createPermFactory("Gerenciar usuários", "Permite desativar outros usuários", 2),
//         createPermFactory("Gerenciar itens do estoque", "Permite Criar, listar, alterar e desativar produtos do estoque", 20),
//         createPermFactory("Consultar itens no estoque", "Consultar itens no estoque", 21),
//         createPermFactory("Vender itens do estoque", "Permissão de vender itens", 30),
//         createPermFactory("Visualizar Relatório de vendas", "Visualizar relatório de vendas", 40),
//     ]
//     return await ctx.prisma.$transaction(
//         toCreatePerms.map((permission) => ctx.prisma.permission.create({ data: permission })),
//     );
// }

// async function setupPermissions(createdGroups: Group[]) {
//     const setup = [
//         { groupname: "SysAdm", permissions: [10, 1, 2, 20, 21, 30, 40] },
//         { groupname: "Op. Estoque", permissions: [1, 20, 21] },
//         { groupname: "Gestor", permissions: [1, 2, 20, 21, 21, 30, 40] },
//         { groupname: "Vendedor", permissions: [2, 21, 30] },

//     ]
//     return await ctx.prisma.$transaction(

//         createdGroups.map(group => {
//             return ctx.prisma.group.update({
//                 where: { id: group.id },
//                 data: {
//                     permissions: {
//                         connect: setup.filter(set => set.groupname == group.name)
//                             .flatMap(set => set.permissions.map(perm => ({ id: perm })))
//                     }
//                 }
//             })
//         })
//     );
// }
// async function adminCreation(adminGroup: Group) {
//     const admin = {
//         name: "System",
//         password: "12345",
//         login: "system",
//         email: "system@storage.com",
//         groupId: adminGroup.id
//     };
//     return await ctx.prisma.user.create({
//         data: admin
//     })
// }

// async function main() {
//     // console.log('creating seed permissions and groups');
//     // const createdGroups = await createGroups();
//     // await createPermissions();
//     // await setupPermissions(createdGroups);
//     // const admin = await adminCreation(createdGroups.filter(g => g.name == "SysAdm")[0])
// }


// main()
//     .then(async () => {
//         await ctx.prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await ctx.prisma.$disconnect()
//         process.exit(1)
//     })