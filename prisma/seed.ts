import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  dummyPrograms,
  dummyFacilities,
  dummyExtracurriculars,
  dummyAchievements,
  dummyNews,
  dummyAgenda,
  dummyTeachers,
  dummyGallery,
  dummyFaqs,
} from "../src/lib/dummy-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data (order matters for FK constraints)
  await prisma.psbSubmission.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.extracurricular.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.program.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.agenda.deleteMany();
  await prisma.news.deleteMany();

  // Seed Programs
  for (const p of dummyPrograms) {
    await prisma.program.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        order: parseInt(p.id),
      },
    });
  }
  console.log(`Seeded ${dummyPrograms.length} programs`);

  // Seed Facilities
  for (const f of dummyFacilities) {
    await prisma.facility.create({
      data: {
        name: f.name,
        description: f.description,
        order: parseInt(f.id),
      },
    });
  }
  console.log(`Seeded ${dummyFacilities.length} facilities`);

  // Seed Extracurriculars
  for (const e of dummyExtracurriculars) {
    await prisma.extracurricular.create({
      data: {
        name: e.name,
        description: e.description,
        order: parseInt(e.id),
      },
    });
  }
  console.log(`Seeded ${dummyExtracurriculars.length} extracurriculars`);

  // Seed Achievements
  for (const a of dummyAchievements) {
    await prisma.achievement.create({
      data: {
        title: a.title,
        category: a.category,
        level: a.level.toLowerCase(),
        year: a.year,
      },
    });
  }
  console.log(`Seeded ${dummyAchievements.length} achievements`);

  // Seed News
  for (const n of dummyNews) {
    await prisma.news.create({
      data: {
        title: n.title,
        slug: n.slug,
        excerpt: n.excerpt,
        content: n.content,
        isPublished: true,
        publishedAt: new Date(n.date),
      },
    });
  }
  console.log(`Seeded ${dummyNews.length} news items`);

  // Seed Agenda
  for (const a of dummyAgenda) {
    await prisma.agenda.create({
      data: {
        title: a.title,
        description: a.description,
        location: a.location,
        startDate: new Date(a.startDate),
        endDate: a.endDate ? new Date(a.endDate) : null,
      },
    });
  }
  console.log(`Seeded ${dummyAgenda.length} agenda items`);

  // Seed Teachers
  for (const t of dummyTeachers) {
    await prisma.teacher.create({
      data: {
        name: t.name,
        role: t.role + (t.subject ? ` - ${t.subject}` : ""),
        order: parseInt(t.id),
      },
    });
  }
  console.log(`Seeded ${dummyTeachers.length} teachers`);

  // Seed Gallery
  for (const g of dummyGallery) {
    await prisma.galleryItem.create({
      data: {
        album: g.album,
        imageUrl: g.image,
        caption: g.caption,
      },
    });
  }
  console.log(`Seeded ${dummyGallery.length} gallery items`);

  // Seed FAQs
  for (const f of dummyFaqs) {
    await prisma.faq.create({
      data: {
        question: f.question,
        answer: f.answer,
        order: parseInt(f.id),
      },
    });
  }
  console.log(`Seeded ${dummyFaqs.length} FAQs`);

  // Seed default admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@alfauzan.sch.id",
      passwordHash: hashedPassword,
      name: "Admin",
    },
  });
  console.log("Seeded default admin user (password: admin123)");

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
