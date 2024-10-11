-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "dateAchat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProduitConsommable" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "seuil" INTEGER NOT NULL,

    CONSTRAINT "ProduitConsommable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DossierMedical" (
    "id" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "DossierMedical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL,
    "fichier" BYTEA NOT NULL,
    "dossierMedicalId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Soin" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Soin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dent" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "Dent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RendezVous" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,
    "patientId" TEXT NOT NULL,
    "salleConsultationId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "RendezVous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalleConsultation" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "capacite" INTEGER NOT NULL,

    CONSTRAINT "SalleConsultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoinEffectue" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "commentaire" TEXT NOT NULL,
    "soinId" TEXT NOT NULL,
    "dentId" TEXT NOT NULL,
    "rendezVousId" TEXT NOT NULL,
    "dossierMedicalId" TEXT NOT NULL,

    CONSTRAINT "SoinEffectue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine_SalleConsultation" (
    "machineId" TEXT NOT NULL,
    "salleConsultationId" TEXT NOT NULL,

    CONSTRAINT "Machine_SalleConsultation_pkey" PRIMARY KEY ("machineId","salleConsultationId")
);

-- CreateTable
CREATE TABLE "ProduitConsommable_Soin" (
    "produitConsommableId" TEXT NOT NULL,
    "soinId" TEXT NOT NULL,

    CONSTRAINT "ProduitConsommable_Soin_pkey" PRIMARY KEY ("produitConsommableId","soinId")
);

-- CreateTable
CREATE TABLE "_RoleToUtilisateur" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DossierMedical_patientId_key" ON "DossierMedical"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUtilisateur_AB_unique" ON "_RoleToUtilisateur"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUtilisateur_B_index" ON "_RoleToUtilisateur"("B");

-- AddForeignKey
ALTER TABLE "DossierMedical" ADD CONSTRAINT "DossierMedical_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_dossierMedicalId_fkey" FOREIGN KEY ("dossierMedicalId") REFERENCES "DossierMedical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_salleConsultationId_fkey" FOREIGN KEY ("salleConsultationId") REFERENCES "SalleConsultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_dentId_fkey" FOREIGN KEY ("dentId") REFERENCES "Dent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_rendezVousId_fkey" FOREIGN KEY ("rendezVousId") REFERENCES "RendezVous"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_dossierMedicalId_fkey" FOREIGN KEY ("dossierMedicalId") REFERENCES "DossierMedical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine_SalleConsultation" ADD CONSTRAINT "Machine_SalleConsultation_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine_SalleConsultation" ADD CONSTRAINT "Machine_SalleConsultation_salleConsultationId_fkey" FOREIGN KEY ("salleConsultationId") REFERENCES "SalleConsultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduitConsommable_Soin" ADD CONSTRAINT "ProduitConsommable_Soin_produitConsommableId_fkey" FOREIGN KEY ("produitConsommableId") REFERENCES "ProduitConsommable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduitConsommable_Soin" ADD CONSTRAINT "ProduitConsommable_Soin_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUtilisateur" ADD CONSTRAINT "_RoleToUtilisateur_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUtilisateur" ADD CONSTRAINT "_RoleToUtilisateur_B_fkey" FOREIGN KEY ("B") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
