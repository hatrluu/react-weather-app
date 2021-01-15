import PropTypes from "prop-types";

function Header(props) {
    return <h1>Hello {props.name}</h1>
}

Header.propTypes = {
    name: PropTypes.string.isRequired
}

Header.defaultProps = {
    name: "User"
}
export default Header;