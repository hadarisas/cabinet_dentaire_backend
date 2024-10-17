-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_dossierMedicalId_fkey";

-- DropForeignKey
ALTER TABLE "DossierMedical" DROP CONSTRAINT "DossierMedical_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Machine_SalleConsultation" DROP CONSTRAINT "Machine_SalleConsultation_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Machine_SalleConsultation" DROP CONSTRAINT "Machine_SalleConsultation_salleConsultationId_fkey";

-- DropForeignKey
ALTER TABLE "ProduitConsommable_Soin" DROP CONSTRAINT "ProduitConsommable_Soin_produitConsommableId_fkey";

-- DropForeignKey
ALTER TABLE "ProduitConsommable_Soin" DROP CONSTRAINT "ProduitConsommable_Soin_soinId_fkey";

-- DropForeignKey
ALTER TABLE "RendezVous" DROP CONSTRAINT "RendezVous_patientId_fkey";

-- DropForeignKey
ALTER TABLE "RendezVous" DROP CONSTRAINT "RendezVous_salleConsultationId_fkey";

-- DropForeignKey
ALTER TABLE "RendezVous" DROP CONSTRAINT "RendezVous_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_dentId_fkey";

-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_dossierMedicalId_fkey";

-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_rendezVousId_fkey";

-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_soinId_fkey";

-- AddForeignKey
ALTER TABLE "DossierMedical" ADD CONSTRAINT "DossierMedical_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_dossierMedicalId_fkey" FOREIGN KEY ("dossierMedicalId") REFERENCES "DossierMedical"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_salleConsultationId_fkey" FOREIGN KEY ("salleConsultationId") REFERENCES "SalleConsultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_dentId_fkey" FOREIGN KEY ("dentId") REFERENCES "Dent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_rendezVousId_fkey" FOREIGN KEY ("rendezVousId") REFERENCES "RendezVous"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_dossierMedicalId_fkey" FOREIGN KEY ("dossierMedicalId") REFERENCES "DossierMedical"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine_SalleConsultation" ADD CONSTRAINT "Machine_SalleConsultation_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine_SalleConsultation" ADD CONSTRAINT "Machine_SalleConsultation_salleConsultationId_fkey" FOREIGN KEY ("salleConsultationId") REFERENCES "SalleConsultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduitConsommable_Soin" ADD CONSTRAINT "ProduitConsommable_Soin_produitConsommableId_fkey" FOREIGN KEY ("produitConsommableId") REFERENCES "ProduitConsommable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduitConsommable_Soin" ADD CONSTRAINT "ProduitConsommable_Soin_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
