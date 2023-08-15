import React, { useState } from 'react'
import { PageLoaderModal } from '../shared/components/PageLoaderModal'
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import {
  faCog,
  faHome,
  faNavicon,
  faRegistered,
  faSearch,
  faSignOutAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { Icon } from '../shared/components/Icon'
import { useSession } from '../shared/contexts/SessionContext'
import { checkRole } from '../utils/roles'
import { Roles } from '../shared/enums/Roles'
import { cn } from '../utils/strings'
import { Divider } from '../shared/components/Divider'
import { Title } from '../elements/Title'
import { IUser } from '../shared/models/IUser'
import { GithubLink } from '../components/GithubLink'
import { Modal } from '../elements/modal/Modal'
import { SearchBar } from '../logged-in-app/SearchBar'

const CheddarrLogoLink = () => {
  return (
    <Link to="/" className="flex items-center place-self-center mb-14">
      <div className="w-12">
        <img className="w-full h-auto" src="/assets/cheddarr-pre.svg" alt="Chedarr" />
      </div>

      <div className="w-8">
        <img className="w-full h-auto" id="cheddarrMinLogo" src="/assets/cheddarr-min.svg" alt="Chedarr" />
      </div>

      <div className="w-12">
        <img className="w-full h-auto" src="/assets/cheddarr-post.svg" alt="Chedarr" />
      </div>
    </Link>
  )
}

const SidebarLink: React.FC<React.PropsWithChildren<LinkProps>> = ({ to, className, children, ...props }) => {
  const classNames = cn(
    'flex items-center gap-2 px-1 py-1.5 hover:bg-primary-light hover:text-primary-darker rounded-full transition-bg transition-text ease-in duration-200 hover:pl-3',
    className,
  )

  return (
    <Link to={to} className={classNames} {...props}>
      {children}
    </Link>
  )
}

const SidebarButton: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  type = 'button',
  className,
  children,
  ...props
}) => {
  const classNames = cn(
    'flex items-center gap-2 px-1 py-1.5 hover:bg-primary-light hover:text-primary-darker rounded-full transition-bg transition-text ease-in duration-200 hover:pl-3',
    className,
  )

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  )
}

const Sidebar = ({ user, onLogout }: { user?: IUser; onLogout: () => void }) => {
  return (
    <nav className="w-[200px] fixed h-full overflow-auto border-r border-primary-dark hidden md:flex flex-col items-center justify-between">
      <div className="p-4">
        <CheddarrLogoLink />

        <div className="flex flex-col gap-3">
          <SidebarLink to="/">
            <Icon icon={faHome} />
            <span>Dashboard</span>
          </SidebarLink>

          {user && checkRole(user.roles, [Roles.REQUEST, Roles.MANAGE_REQUEST], true) && (
            <SidebarLink to="/requests" className="flex items-center gap-2">
              <Icon icon={faRegistered} />
              <span>Requests</span>
            </SidebarLink>
          )}

          {user && checkRole(user.roles, [Roles.MANAGE_USERS]) && (
            <SidebarLink to="/users" className="flex items-center gap-2">
              <Icon icon={faUsers} />
              <span>Users</span>
            </SidebarLink>
          )}

          {user && checkRole(user.roles, [Roles.MANAGE_SETTINGS]) && (
            <SidebarLink to="/settings" className="flex items-center gap-2">
              <Icon icon={faCog} />
              <span>Settings</span>
            </SidebarLink>
          )}
        </div>
      </div>

      {user && (
        <div className="w-full">
          <div className="p-4">
            <SidebarLink to="/profile" className="flex items-center gap-3">
              <div className="w-12">
                <img src={user?.avatar} alt="User" className="rounded-full aspect-square w-full h-auto" />
              </div>
              <span className="font-bold">{user?.username}</span>
            </SidebarLink>
          </div>

          <Divider className="w-full" />

          <div className="p-4">
            <div className="flex flex-col gap-3">
              <SidebarButton onClick={() => onLogout()}>
                <Icon icon={faSignOutAlt} />
                <span>Sign out</span>
              </SidebarButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

const BottombarLink: React.FC<React.PropsWithChildren<LinkProps>> = ({ to, className, children, ...props }) => {
  const classNames = cn(
    'w-full h-full flex items-center justify-center text-primary-dark hover:text-primary-darker transition-colors ease-in duration-200',
    className,
  )

  return (
    <Link to={to} className={classNames} {...props}>
      {children}
    </Link>
  )
}

const BottombarButton: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  type = 'button',
  className,
  children,
  ...props
}) => {
  const classNames = cn(
    'w-full h-full flex items-center justify-center text-primary-dark hover:text-primary-darker transition-colors ease-in duration-200',
    className,
  )

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  )
}

const BottombarExtendedLink: React.FC<React.PropsWithChildren<LinkProps>> = ({ to, className, children, ...props }) => {
  const classNames = cn(
    'flex items-center gap-2 px-1 py-1.5 hover:bg-primary-light hover:text-primary-darker rounded-full transition-bg transition-text ease-in duration-200 hover:pl-3',
    className,
  )

  return (
    <Link to={to} className={classNames} {...props}>
      {children}
    </Link>
  )
}

const BottombarExtendedButton: React.FC<
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>
  // eslint-disable-next-line react/prop-types
> = ({ type = 'button', className, children, ...props }) => {
  const classNames = cn(
    'flex items-center gap-2 px-1 py-1.5 hover:bg-primary-light hover:text-primary-darker rounded-full transition-bg transition-text ease-in duration-200 hover:pl-3',
    className,
  )

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  )
}

const Bottombar = ({ user, onLogout }: { user?: IUser; onLogout: () => void }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="w-full h-[60px] fixed bottom-0 md:hidden z-nav px-2">
        <div className="w-full h-full grid grid-cols-3 items-center bg-primary-light rounded-t-xl border-2 border-primary-dark">
          <BottombarButton onClick={() => setOpen(true)}>
            <Icon icon={faNavicon} />
          </BottombarButton>

          <BottombarLink to="/" className="border-x border-x-primary-dark">
            <Icon icon={faHome} />
          </BottombarLink>

          <BottombarLink to="/search">
            <Icon icon={faSearch} />
          </BottombarLink>
        </div>
      </nav>

      <Modal isOpen={open} onClose={() => setOpen(false)} variant="fullScreen">
        <div className="w-full h-full flex flex-col justify-between bg-primary-darker p-4">
          <div className="flex flex-col">
            <Title as="h1" className="place-self-center">
              <CheddarrLogoLink />
            </Title>

            <div className="flex flex-col gap-3">
              <BottombarExtendedLink to="/" onClick={() => setOpen(false)}>
                <Icon icon={faHome} />
                <span>Dashboard</span>
              </BottombarExtendedLink>

              {user && checkRole(user.roles, [Roles.REQUEST, Roles.MANAGE_REQUEST], true) && (
                <BottombarExtendedLink
                  to="/requests"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <Icon icon={faRegistered} />
                  <span>Requests</span>
                </BottombarExtendedLink>
              )}

              {user && checkRole(user.roles, [Roles.MANAGE_USERS]) && (
                <BottombarExtendedLink to="/users" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <Icon icon={faUsers} />
                  <span>Users</span>
                </BottombarExtendedLink>
              )}

              {user && checkRole(user.roles, [Roles.MANAGE_SETTINGS]) && (
                <BottombarExtendedLink
                  to="/settings"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <Icon icon={faCog} />
                  <span>Settings</span>
                </BottombarExtendedLink>
              )}
            </div>
          </div>

          <div>
            <BottombarExtendedButton onClick={() => onLogout()}>
              <Icon icon={faSignOutAlt} />
              <span>Sign out</span>
            </BottombarExtendedButton>
            <Divider className="my-3" />
            <div className="flex items-center justify-between">
              <BottombarExtendedLink to="/profile" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <div className="w-12">
                  <img src={user?.avatar} alt="User" className="rounded-full aspect-square w-full h-auto" />
                </div>
                <span className="font-bold">{user?.username}</span>
              </BottombarExtendedLink>

              <GithubLink />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

const Navbar = () => {
  return (
    <nav className="w-full hidden md:flex items-center justify-between gap-3 p-4">
      <div className="w-full">
        <SearchBar />
      </div>
      <GithubLink />
    </nav>
  )
}

const Router = React.lazy(() => import('./router'))

export default () => {
  const {
    session: { user },
    invalidSession,
  } = useSession()

  return (
    <>
      <Sidebar user={user} onLogout={() => invalidSession()} />
      <div className="pb-[60px] md:mb-0 md:ml-[200px]">
        <Navbar />
        <div className="p-4">
          <React.Suspense fallback={<PageLoaderModal />}>
            <Router />
          </React.Suspense>
        </div>
      </div>
      <Bottombar user={user} onLogout={() => invalidSession()} />
    </>
  )
}
