import { Container } from "@/components/common/container";

type SectionProps = {
  id?: string;
  children?: React.ReactNode;
  className?: string;
};

export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className="border-b border-border">
      <Container className={className}>{children}</Container>
    </section>
  );
}
