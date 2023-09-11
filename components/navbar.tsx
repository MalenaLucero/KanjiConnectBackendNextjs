import Link from "next/link"

export default function Navbar() {
  return (
    <ul className="navbar">
      <li className="navbar-item">
        <Link href="/next-practice">Index</Link>
      </li>
      <li className="navbar-item">
        <Link href="/next-practice/about">About</Link>
      </li>
      <li className="navbar-item">
        <Link href="/next-practice/posts/1">Posts</Link>
      </li>
    </ul>
  )
}