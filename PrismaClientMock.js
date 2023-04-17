module.exports = jest.fn().mockImplementation(() => {
    return {
        user: {
            create: jest.fn((data) => {
                return {
                    id: 1,
                    ...data,
                }
            }),
            delete: jest.fn((where) => {
                return {
                    id: where.id,
                }
            }),
            findMany: jest.fn(() => {
                return [
                    {
                        id: 1,
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        login: 'johndoe',
                        password: 'password123',
                        groupId: 1,
                    },
                    {
                        id: 2,
                        name: 'Jane Doe',
                        email: 'jane.doe@example.com',
                        login: 'janedoe',
                        password: 'password456',
                        groupId: 2,
                    },
                ]
            }),
            update: jest.fn((params) => {
                return {
                    ...params.data,
                    id: params.where.id,
                }
            }),
            createMany: jest.fn((params) => {
                return {
                    count: params.data.length,
                }
            }),
        },
    }
})
