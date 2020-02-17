#!/usr/local/bin/bash

### Description
#   Generate component directory depending on the string path parameter
#   Add Component.js Component.test.js and Component.css to the directory created
#   Add the minimal piece of code for each of those files

### Parameters
#   - path: The path where the component is created

### Examples
#   1) ./gen-comp.sh component/users/userProfile will create:
#
#       - src
#           - component
#               - users
#                   - userProfile
#                       - UserProfile.js
#                       - UserProfile.test.js
#                       - UserProfile.css

if [[ $# -ne 1 ]]
then
    echo "Number of parameters incorect"
    echo "Usage: $0 path/to/new/component"
    exit 1
fi

# Get component name and transform it (ex: /component/home/nAvbAR --> Navbar)
name=$(basename $1)
prefix=${name:0:1}
maj_prefix=${prefix^}
sufix=${name:1}
min_sufix=${sufix,,}
component_name=${maj_prefix}${min_sufix}

# Build the component path
src="./src/"
comp_path=${src}$1

# Create component directory
mkdir -p $comp_path

# Fill the component directory with the Component.js file and his minimal content
component_content="import React from 'react';\nimport './$component_name.css';\n\nfunction $component_name() {\n\treturn (\n\t\t<div className=\"$component_name\">\n\t\t\t<p>My new component !</p>\n\t\t</div>\n\t);\n}\n\nexport default $component_name;\n"
echo -e $component_content > ${comp_path}/${component_name}.js

# Fill the component directory with the Component.test.js file and his minimal content
test_content="import React from 'react';\nimport { render } from '@testing-library/react';\nimport $component_name from './$component_name';\n\ntest('Component className is $component_name', () => {\n\tconst { container } = render(<$component_name />);\n\texpect(container.firstChild).toHaveClass('$component_name');\n});\n"
echo -e $test_content > ${comp_path}/${component_name}.test.js

# Fill the component directory with the Component.css file and his minimal content
touch ${comp_path}/${component_name}.css


