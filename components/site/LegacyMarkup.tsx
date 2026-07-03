type LegacyMarkupProps = {
  html: string;
};

export function LegacyMarkup({ html }: LegacyMarkupProps) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
