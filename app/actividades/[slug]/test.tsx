export default function TestPage({ params }: { params: { slug: string } }) {
  return <div style={{padding:100,fontSize:24}}>slug: &quot;{params.slug}&quot;</div>;
}
