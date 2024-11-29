-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accentColor" TEXT NOT NULL DEFAULT 'blue',
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE "_ProjectToTag" ADD CONSTRAINT "_ProjectToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProjectToTag_AB_unique";

-- AlterTable
ALTER TABLE "_ProjectToTeam" ADD CONSTRAINT "_ProjectToTeam_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProjectToTeam_AB_unique";

-- AlterTable
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProjectToUser_AB_unique";

-- AlterTable
ALTER TABLE "_TagToTask" ADD CONSTRAINT "_TagToTask_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TagToTask_AB_unique";

-- AlterTable
ALTER TABLE "_TaskDependencies" ADD CONSTRAINT "_TaskDependencies_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TaskDependencies_AB_unique";
