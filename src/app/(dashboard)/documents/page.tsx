import Header from "@/components/layout/Header";
import DocumentUpload from "@/components/upload/DocumentUpload";

export default function DocumentsPage() {
  return (
    <>
      <Header
        title="Training Data"
        subtitle="Upload documents to build the Conceivable voice and knowledge base"
      />
      <DocumentUpload />
    </>
  );
}
