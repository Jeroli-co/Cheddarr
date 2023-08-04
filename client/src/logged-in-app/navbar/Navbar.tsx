import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import { Button } from '../../elements/button/Button'
import { Icon } from '../../shared/components/Icon'
import { SearchBar } from './components/search-bar/SearchBar'
import { GithubLink } from '../../components/GithubLink'

// type DropdownMenuProps = {
//   user?: IUser
// }

// const DropdownMenu = ({ user }: DropdownMenuProps) => {
//   const { invalidSession } = useSession()

//   if (!user) return undefined

//   return (
//     <RadixDropdownMenu.Root>
//       <RadixDropdownMenu.Trigger>
//         <div className="w-12">
//           <img src={user?.avatar} alt="User" className="rounded-full aspect-square w-full h-auto" />
//         </div>
//       </RadixDropdownMenu.Trigger>
//       <RadixDropdownMenu.Portal>
//         <RadixDropdownMenu.Content>
//           <RadixDropdownMenu.Item>
//             <Link to="/profile">
//               <FontAwesomeIcon icon={faUserCircle} />
//               <span>Profile</span>
//             </Link>
//           </RadixDropdownMenu.Item>
//           <RadixDropdownMenu.Separator />
//           <RadixDropdownMenu.Item>
//             <button onClick={() => invalidSession()}>
//               <FontAwesomeIcon icon={faSignOutAlt} />
//               <span>Sign out</span>
//             </button>
//           </RadixDropdownMenu.Item>
//         </RadixDropdownMenu.Content>
//       </RadixDropdownMenu.Portal>
//     </RadixDropdownMenu.Root>
//   )
// }

export const Navbar = () => {
  return (
    <nav className="w-full hidden md:flex items-center justify-between gap-3 p-4">
      <SearchBar />
      <GithubLink />
    </nav>
  )
}
