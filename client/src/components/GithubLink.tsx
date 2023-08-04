import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { Button } from '../elements/button/Button'
import { Icon } from '../shared/components/Icon'
import { Link } from 'react-router-dom'

export const GithubLink = () => {
  return (
    <Button variant="link" className="place-self-end self-center" asChild>
      <Link to="https://github.com/Jeroli-co/Cheddarr" target="_blank">
        <Icon icon={faGithub} size="lg" />
      </Link>
    </Button>
  )
}
