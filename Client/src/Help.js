import Navbar from './NavBar';

const Help = () =>{
    return(
        <div className='background'>
            <Navbar/>
          <h1>
            Help
          </h1>
          <h2>
            Commonly asked questions
          </h2>
          <p>
            Q: If I delete a folder, does it delete all of the folders beneath it?
          <br/>
            A: Yes, if you want to save info from any child folders copy them and move them somewhere else first
          </p>
          <p>
            Q: I accidently deleted a folder that contained everything, can I get it back?
          <br/>
            A: No, sorry.
          </p>
          <h2>
            Contact Support at:
          </h2>
          <ul>
            <li>Phone number:(123)-456-7890</li>
            <li>Email: quiztopia@quiz.com</li>
          </ul>            
          <br/>
        </div>
    )
}
export default Help;