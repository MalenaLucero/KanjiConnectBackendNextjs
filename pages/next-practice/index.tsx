import Layout from "../../components/layout";

//The router will automatically route files named index to the root of the directory.
//http://localhost:3000/next-practice -> takes you to this index

export default function Index() {
  return (
    <Layout>
      <div className="page">Index content</div>
    </Layout>
  )
}