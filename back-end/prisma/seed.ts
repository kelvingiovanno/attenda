import { faker } from '@faker-js/faker';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
    AttendanceStatus,
    PrismaClient,
    UserRole,
} from '../generated/prisma/client';

const adapter = new PrismaMariaDb({
    host: process.env['DATABASE_HOST'],
    user: process.env['DATABASE_USER'],
    password: process.env['DATABASE_PASSWORD'],
    database: process.env['DATABASE_NAME'],
    connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    const firstEmployee = await prisma.employee.findFirst();

    if (!firstEmployee) {
        console.log('No employees found.');
        return;
    }

    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'dummyhash',
            role: UserRole.ADMIN,
            employeeId: firstEmployee.id,
        },
    });

    console.log('✅ Admin created');

    const employees = await prisma.employee.findMany();

    for (const emp of employees) {
        await prisma.user.upsert({
            where: { employeeId: emp.id },
            update: {},
            create: {
                employeeId: emp.id,
                username: emp.fullname.toLowerCase().replace(/ /g, '_'),
                password: 'dummyhash',
                role: UserRole.EMPLOYEE,
            },
        });
    }

    console.log('✅ Users generated');

    const DAYS = 30;

    const attendances: any[] = [];

    for (const emp of employees) {
        for (let i = 0; i < DAYS; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // skip weekend (optional realism)
            const day = date.getDay();
            if (day === 0 || day === 6) continue;

            const randomMinute = faker.number.int({ min: 0, max: 20 });

            const checkIn = new Date(date);
            checkIn.setHours(8, randomMinute, 0);

            const status =
                Math.random() < 0.1
                    ? AttendanceStatus.LATE
                    : AttendanceStatus.PRESENT;

            attendances.push({
                employeeId: emp.id,
                checkIn,
                photoUrl: `photos/${emp.fullname
                    .toLowerCase()
                    .replace(/ /g, '_')}_${i}.jpg`,
                status,
            });
        }
    }

    console.log(`Creating ${attendances.length} attendance records...`);

    // bulk insert (FAST)
    await prisma.attendance.createMany({
        data: attendances,
    });

    console.log('✅ Attendance generated');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('🌱 Seed finished');
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
