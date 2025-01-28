
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <h2 className='text-xl font bold lg:text-7xl m-10'>404 Error: Page not Found</h2>
            <Link to={'/'}> <button className='btn'>Go Back</button></Link>
        </div>
    );
};

export default ErrorPage;