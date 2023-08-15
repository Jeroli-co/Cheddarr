import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { FORM_DEFAULT_VALIDATOR } from '../../shared/enums/FormDefaultValidators'
import { useAuthentication } from '../../shared/contexts/AuthenticationContext'
import { Divider } from '../../shared/components/Divider'
import { usePlexAuth } from '../../shared/contexts/PlexAuthContext'
import { Input } from '../../elements/Input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Title } from '../../elements/Title'
import { Button } from '../../elements/button/Button'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const usernameValidator = z
  .string({ required_error: 'New username required' })
  .min(3, { message: 'Min 3 characters long' })
  .max(20, { message: 'Max 20 character long' })
  .regex(/^[a-zA-Z0-9]+$/)

const signUpSchema = z
  .object({
    username: usernameValidator,
    password: z
      .string({ required_error: 'Password required' })
      .trim()
      .regex(FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value, {
        message: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message,
      }),
    passwordConfirmation: z.string({ required_error: 'Confirmation required' }).trim(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  })

export type SignUpFormData = z.infer<typeof signUpSchema>

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<SignUpFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
  })
  const { signUp } = useAuthentication()
  const { signInWithPlex } = usePlexAuth()

  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false)

  const watchUsername = watch('username')

  const onSubmit = handleSubmit(async (data) => {
    const res = await signUp(data)
    const { status } = res
    if (status === 409) {
      setError('username', {
        type: 'manual',
        message: 'Username already taken',
      })
    }
  })

  const validateUsername = () => {
    const parsed = usernameValidator.safeParse(watchUsername)
    if (!parsed.success) return
    else setIsPasswordDisplayed(true)
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      !isPasswordDisplayed ? validateUsername() : onSubmit()
    }
  }

  useEffect(() => {
    if (errors.username) {
      setIsPasswordDisplayed(false)
    }
  }, [errors.username])

  return (
    <>
      <img src="/assets/cheddarr.svg" alt="logo" className="mb-8" />

      <Title as="h1" variant="center">
        {!isPasswordDisplayed ? 'Hi, Who are you ?' : `Welcome ${watchUsername} !`}
      </Title>

      {isPasswordDisplayed && (
        <Title as="h2" variant="center">
          Create your password
        </Title>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <div className="space-y-3">
          {!isPasswordDisplayed && (
            <Input
              icon={faUser}
              label="Username"
              type="text"
              placeholder="Username"
              error={errors.username?.message}
              onKeyDown={handleKeydown}
              autoComplete="email"
              {...register('username')}
            />
          )}

          {isPasswordDisplayed && (
            <>
              <Input
                icon={faKey}
                label="Password"
                type="password"
                placeholder="Strong password"
                error={errors.password?.message}
                onKeyDown={handleKeydown}
                autoComplete="off"
                {...register('password')}
              />

              <Input
                icon={faKey}
                label="Confirm password"
                type="password"
                placeholder="Confirm password"
                error={errors.passwordConfirmation?.message}
                onKeyDown={handleKeydown}
                autoComplete="off"
                {...register('passwordConfirmation')}
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-between">
          <div className="flex items-center gap-2">
            <p className="hidden md:block">Already have an account ?</p>
            <Button variant="link" asChild>
              <Link to="/auth/sign-in" replace>
                Sign in
              </Link>
            </Button>
          </div>

          {!isPasswordDisplayed && (
            <Button type="button" onClick={() => validateUsername()}>
              Next
            </Button>
          )}
          {isPasswordDisplayed && <Button type="submit">Sign up</Button>}
        </div>

        <Divider />

        <div className="flex flex-col items-center">
          <Title as="h2" variant="center">
            Authentication provider
          </Title>

          <Button color="plex" className="place-self-center" onClick={() => signInWithPlex()}>
            <img className="w-6 h-auto" src="/assets/plex.png" alt="Plex logo" />
            Sign up with plex
          </Button>
        </div>
      </form>
    </>
  )
}
