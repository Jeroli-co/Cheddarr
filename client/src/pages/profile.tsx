import styled from 'styled-components'
import { Spinner } from '../shared/components/Spinner'
import { UpdateProfile } from '../logged-in-app/pages/user-profile/account/UpdateProfile'
import { H1, H2 } from '../shared/components/Titles'
import { STATIC_STYLES } from '../shared/enums/StaticStyles'
import { PrimaryDivider } from '../shared/components/Divider'
import { useParams } from 'react-router'
import { useUser } from '../shared/hooks/useUser'
import { Roles } from '../shared/enums/Roles'
import { useUserService } from '../shared/toRefactor/useUserService'
import { RolesTree } from '../shared/components/RolesTree'
import { checkRole } from '../utils/roles'
import { useSession } from '../shared/contexts/SessionContext'

const SubContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  flex-wrap: wrap;
`

const InfosContainer = styled.div`
  text-align: center;

  p {
    margin-top: 10px;
  }

  .username {
    font-weight: bold;
  }

  width: 20%;
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 100%;
  }
`

const UserPictureStyle = styled.img`
  width: 75%;
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 50%;
  }
`

type RouteParams = {
  id?: string
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { id } = useParams<RouteParams>()

  const { currentUser: profileOwner, updateUser, isLoading } = useUser(id)
  const { updateUserById } = useUserService()
  const {
    session: { user },
  } = useSession()

  const onRoleChange = (role: Roles) => {
    if (profileOwner?.id) {
      updateUserById(profileOwner.id, { roles: role }, 'Cannot update roles', 'Roles updated').then(
        (res) => {
          if (res.status === 200 && res.data) {
            updateUser(res.data)
          }
        }
      )
    }
  }

  if (isLoading) return <Spinner />

  return (
    <>
      <H1>Account</H1>
      <PrimaryDivider />
      <div>
        <SubContainer>
          <InfosContainer>
            <UserPictureStyle src={profileOwner?.avatar} alt="User" />
            <p className="username">
              <i>{'@' + profileOwner?.username}</i>
            </p>
            {user &&
              profileOwner &&
              profileOwner.roles &&
              checkRole(user.roles, [Roles.ADMIN, Roles.MANAGE_USERS], true) && (
                <p>{profileOwner.email}</p>
              )}
          </InfosContainer>
          <div>
            {user &&
              profileOwner &&
              profileOwner.roles &&
              checkRole(user.roles, [Roles.ADMIN, Roles.MANAGE_USERS], true) && (
                <>
                  <H2>User roles</H2>
                  <RolesTree defaultValue={profileOwner.roles} onSave={onRoleChange} />
                </>
              )}
          </div>
        </SubContainer>
        <PrimaryDivider />
        {profileOwner?.id && <UpdateProfile id={profileOwner.id} />}
      </div>
    </>
  )
}
