import { useRouter } from 'next/router'
import Layout from '../../../components/layout'

//http://localhost:3000/next-practice/posts/1
 
export default function Post() {
  const router = useRouter()
  const id = router.query.id
  
  return (
    <Layout>
      <div className="page">
        <p>ID: {id}</p>
      </div>
    </Layout>
  )
}