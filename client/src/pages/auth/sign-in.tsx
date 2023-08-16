import { useState } from 'react'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { useLocation, Link } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthentication } from '../../shared/contexts/AuthenticationContext'
import { usePlexAuth } from '../../shared/contexts/PlexAuthContext'
import { Divider } from '../../shared/components/Divider'
import { Title } from '../../elements/Title'
import { Input } from '../../elements/Input'
import { Button } from '../../elements/button/Button'
import { InitResetPasswordModal } from '../../components/InitResetPasswordModal'

const signInSchema = z.object({
  username: z.string({ required_error: 'Username required' }).trim(),
  password: z.string({ required_error: 'Password required' }).trim(),
})

export type SignInFormData = z.infer<typeof signInSchema>

const useRedirectURI = () => {
  const query = new URLSearchParams(useLocation().search)
  return query.get('redirectURI')
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { signIn } = useAuthentication()
  const { signInWithPlex } = usePlexAuth()
  const redirectURI = useRedirectURI()
  const [isInitPasswordModalOpen, setIsInitPasswordModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit((data) => {
    redirectURI ? signIn(data, redirectURI) : signIn(data)
  })

  const initSignInWithPlex = () => {
    redirectURI ? signInWithPlex(redirectURI) : signInWithPlex()
  }

  return (
    <>
      <img src="/assets/cheddarr.svg" alt="logo" className="mb-8" />

      <Title as="h1" variant="center">
        Sign in to your account
      </Title>

      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <div className="space-y-3">
          <Input
            icon={faUser}
            label="Username or email"
            type="text"
            placeholder="Username or email"
            error={errors.username?.message}
            autoComplete="email"
            {...register('username')}
          />

          <div className="flex flex-col gap-1">
            <Input
              icon={faKey}
              label="Password"
              type="password"
              placeholder="Password"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password')}
            />
            <Button variant="link" className="place-self-start" onClick={() => setIsInitPasswordModalOpen(true)}>
              Forgot your password ?
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-between">
          <div className="flex items-center gap-2">
            <p className="hidden md:block">Still not have an account ?</p>
            <Button variant="link" asChild>
              <Link to="/auth/sign-up" replace>
                Sign up
              </Link>
            </Button>
          </div>

          <Button type="submit">Sign in</Button>
        </div>

        <Divider />

        <div className="flex flex-col items-center">
          <Title as="h2" variant="center">
            Authentication provider
          </Title>

          <Button color="plex" className="place-self-center" onClick={() => initSignInWithPlex()}>
            <img className="w-6 h-auto" src="/assets/plex.png" alt="Plex logo" />
            Sign in with Plex
          </Button>
        </div>
      </form>

      {isInitPasswordModalOpen && <InitResetPasswordModal closeModal={() => setIsInitPasswordModalOpen(false)} />}
    </>
  )
}