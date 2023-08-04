import React from 'react'
import { Navbar } from '../logged-in-app/navbar/Navbar'
import { PageLoader } from '../shared/components/PageLoader'
import { Link, LinkProps } from 'react-router-dom'
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
import { NewDivider } from '../shared/components/Divider'
import { Modal, ModalContent, ModalTitle, ModalTrigger } from '../elements/Modal'
import { Title } from '../elements/Title'
import { IUser } from '../shared/models/IUser'
import { GithubLink } from '../components/GithubLink'

const CheddarrLogoLink = () => {
  return (
    <Link to="/" className="flex items-center place-self-center mb-14">
      <div className="w-12">
        <img className="w-full h-auto" src="/assets/cheddarr-pre.svg" alt="Chedarr" />
      </div>

      <div className="w-8">
        <img
          className="w-full h-auto"
          id="cheddarrMinLogo"
          src="/assets/cheddarr-min.svg"
          alt="Chedarr"
        />
      </div>

      <div className="w-12">
        <img className="w-full h-auto" src="/assets/cheddarr-post.svg" alt="Chedarr" />
      </div>
    </Link>
  )
}

const Sidebar = ({ user, onLogout }: { user?: IUser; onLogout: () => void }) => {
  const SidebarLink: React.FC<React.PropsWithChildren<LinkProps>> = ({
    to,
    className,
    children,
    ...props
  }) => {
    const classNames = cn(
      'flex items-center gap-2 px-1 py-1.5 hover:bg-primary-light hover:text-primary-darker rounded-full transition-bg transition-text ease-in duration-200 hover:pl-3',
      className
    )

    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    )
  }

  const SidebarButton: React.FC<
    React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>
  > = ({ type = 'button', className, children, ...props }) => {
    const classNames = cn(
      'flex items-center gap-2 px-1 py-1.5 hover:bg-primary-light hover:text-primary-darker rounded-full transition-bg transition-text ease-in duration-200 hover:pl-3',
      className
    )

    return (
      <button type="button" className={classNames} {...props}>
        {children}
      </button>
    )
  }

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
                <img
                  src={user?.avatar}
                  alt="User"
                  className="rounded-full aspect-square w-full h-auto"
                />
              </div>
              <span className="font-bold">{user?.username}</span>
            </SidebarLink>
          </div>

          <NewDivider className="w-full" />

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

export const BottombarExtendedModal: React.FC<{
  user?: IUser
  open: boolean
  triggerElement: React.ReactNode
  onClose: () => void
}> = ({ user, triggerElement, onClose, ...props }) => {
  const BottombarExtendedLink: React.FC<React.PropsWithChildren<LinkProps>> = ({
    to,
    className,
    children,
    ...props
  }) => {
    const classNames = cn(
      'flex items-center gap-2 px-1 py-1.5 hover:bg-primary-light hover:text-primary-darker rounded-full transition-bg transition-text ease-in duration-200 hover:pl-3',
      className
    )

    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <Modal {...props}>
      <ModalTrigger>{triggerElement}</ModalTrigger>
      <ModalContent className="w-full h-full bg-primary-darker animate-slide-b-t" onClose={onClose}>
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col">
            <ModalTitle className="place-self-center">
              <Title as="h1">
                <CheddarrLogoLink />
              </Title>
            </ModalTitle>

            <div className="flex flex-col gap-3">
              <BottombarExtendedLink to="/" onClick={() => onClose()}>
                <Icon icon={faHome} />
                <span>Dashboard</span>
              </BottombarExtendedLink>

              {user && checkRole(user.roles, [Roles.REQUEST, Roles.MANAGE_REQUEST], true) && (
                <BottombarExtendedLink
                  to="/requests"
                  className="flex items-center gap-2"
                  onClick={() => onClose()}
                >
                  <Icon icon={faRegistered} />
                  <span>Requests</span>
                </BottombarExtendedLink>
              )}

              {user && checkRole(user.roles, [Roles.MANAGE_USERS]) && (
                <BottombarExtendedLink
                  to="/users"
                  className="flex items-center gap-2"
                  onClick={() => onClose()}
                >
                  <Icon icon={faUsers} />
                  <span>Users</span>
                </BottombarExtendedLink>
              )}

              {user && checkRole(user.roles, [Roles.MANAGE_SETTINGS]) && (
                <BottombarExtendedLink
                  to="/settings"
                  className="flex items-center gap-2"
                  onClick={() => onClose()}
                >
                  <Icon icon={faCog} />
                  <span>Settings</span>
                </BottombarExtendedLink>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <BottombarExtendedLink
              to="/profile"
              className="flex items-center gap-3"
              onClick={() => onClose()}
            >
              <div className="w-12">
                <img
                  src={user?.avatar}
                  alt="User"
                  className="rounded-full aspect-square w-full h-auto"
                />
              </div>
              <span className="font-bold">{user?.username}</span>
            </BottombarExtendedLink>

            <GithubLink />
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}

const Bottombar = ({ user }: { user?: IUser }) => {
  const [open, setOpen] = React.useState(false)

  const BottombarLink: React.FC<React.PropsWithChildren<LinkProps>> = ({
    to,
    className,
    children,
    ...props
  }) => {
    const classNames = cn(
      'w-full h-full flex items-center justify-center text-primary-dark hover:text-primary-darker transition-colors ease-in duration-200',
      className
    )

    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    )
  }

  const BottombarButton: React.FC<
    React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>
  > = ({ type = 'button', className, children, ...props }) => {
    const classNames = cn(
      'w-full h-full flex items-center justify-center text-primary-dark hover:text-primary-darker transition-colors ease-in duration-200',
      className
    )

    return (
      <button type="button" className={classNames} {...props}>
        {children}
      </button>
    )
  }

  return (
    <nav className="w-full h-[60px] fixed bottom-0 md:hidden z-nav px-2">
      <div className="w-full h-full grid grid-cols-3 items-center bg-primary-light rounded-t-xl border-2 border-primary-dark">
        <BottombarExtendedModal
          user={user}
          open={open}
          onClose={() => setOpen(false)}
          triggerElement={
            <BottombarButton onClick={() => setOpen(true)}>
              <Icon icon={faNavicon} />
            </BottombarButton>
          }
        />

        <BottombarLink to="/" className="border-x border-x-primary-dark">
          <Icon icon={faHome} />
        </BottombarLink>

        <BottombarButton>
          <Icon icon={faSearch} />
        </BottombarButton>
      </div>
    </nav>
  )
}

const Router = React.lazy(() => import('./router'))

// eslint-disable-next-line import/no-anonymous-default-export
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
          <React.Suspense fallback={<PageLoader />}>
            <Router />
          </React.Suspense>
        </div>
      </div>
      <Bottombar user={user} />
    </>
  )
}
