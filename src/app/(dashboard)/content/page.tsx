import Header from "@/components/layout/Header";
import ContentStudio from "@/components/content/ContentStudio";

export default function ContentPage() {
  return (
    <>
      <Header
        title="Content Studio"
        subtitle="Generate and manage multi-platform content"
      />
      <ContentStudio />
    </>
  );
}
