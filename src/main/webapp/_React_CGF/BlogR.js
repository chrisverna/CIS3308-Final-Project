"use strict";

function BlogR() {
    return (
        <div className="blog">
            <h4>Sample Blog Entry</h4>
            <p>
                Hey guys -- the Blog Component works !
            </p>

            <div className="section">
                <h3>My Web Development Experience</h3>
                <p>My web development experience started with this class.
                    I am learning so many new and valuable things in this class
                    which is really exciting to me
                </p>
            </div>

            <div className="section">
                <h3>Link to Server Page</h3>
                <p>
                    <a href="https://cis-linux2.temple.edu/tomcat10/sp26_3308_tuq60693/index.html">
                        Click here to invoke compiled Java code</a>
                </p>
            </div>

            <div className="section">
                <h3>Database Design</h3>
                <ul>
                    <li>stats_id - INT (primary key, auto increment)</li>
                    <li>player_name - VARCHAR (unique)</li>
                    <li>image - VARCHAR (nullable)</li>
                    <li>total_tackles - INT (nullable)</li>
                    <li>solo_tackles - INT (nullable)</li>
                    <li>interceptions - INT (nullable)</li>
                    <li>sacks - DECIMAL (nullable)</li>
                    <li>tackles_for_loss - INT (nullable)</li>
                    <li>accolades (probowl, all-pro, droy) - VARCHAR (nullable)</li>
                    <li>web_user_id - INT (foreign key)</li>
                </ul>
                <p>
                Click <a target="_blank" href="docs/Verna_database.pdf">here</a> to see my database document.
                </p>

            </div>

            <div className="section">
                <h3>My Database Experience</h3>
                <p>My database experience also starts with this class.
                 I have enjoyed learning about databases and I know it will be
                 an important subject to understand for my professional career.</p>
            </div>

            <div className="section">
                <h3>List Stats API</h3>
                <p>To see my <strong>List Stats API</strong> open up in a new tab,
                click <a href="stats/getAll" target="_blank">here</a>.</p>


                <p>Click <a target="_blank" href="docs/Web_API_DB_errors.pdf">
                here</a> to see my Web API error document.</p>
            </div>



            <div className="section">
                <h3>Homework Module Reflection</h3>
                <p>HW01 was a solid introduction to this class. I struggled a bit at first since
                all of this is new to me but once I got it to work it felt good.</p>

                <p>HW02 we started to set up our database. I liked this module because
                we were able to have a bit of creativity with our choice of topic.
                I also liked the user interface of MySQLWorkbench.</p>

                <p>HW03 has been the most time consuming for me.
                I don't find this module particularly tricky I think the most
                confusing part is keeping track of all the different files and what they do.</p>

                <p>HW04 was not too bad. I thought it was cool to create a js component that was interactive.
                I felt like I could actually design my website in a way that really made it start to feel like 
                a website that I would use in my day to day life. </p>

                <p>HW05 was interesting because I really began to understand what web API actually is and how to impliment it.
                The most difficult part about it was figuring out how to add the rest of the
                fields in my stats db table. </p>

                <p>HW06 helped me understand how user logon actually works in a web app. The most confusing part for me was
                understanding the relationship between the client side React code, the web APIs, and the server-side session object.
                Once I understood that the logon API checks the database, stores the logged in user in session, and that Get Profile
                reads from the session without going back to the database, the module made a lot more sense.</p>

                <p>HW07 was one of the more challenging assignments because it required combining multiple concepts together. 
                The most difficult part was implementing both sorting and filtering at the same time and making
                sure they didn't break each other. I also had to handle different data types correctly,
                like making sure numbers and dates sorted properly and that null values appeared at the top.</p>

                <p> HW08 focused on building insert functionality for both users and my stats table.
                The most challenging part was connecting the React forms to the backend APIs and handling
                validation and errors properly. Overall, this assignment helped me better understand how the front end
                and backend communicate and how to manage user input in a full web application.</p>

                <p> HW09 helped me understand how insert and update functionality can be combined into a single reusable component.
                The most confusing part was managing state and making sure the correct API endpoint was called based on whether 
                it was insert or update. Styling the pages was straightforward once the structure was set up, and adding the insert
                icon was simple. Overall, this assignment made the app feel more complete and closer to a real-world application. </p>

                <p> HW10 helped me understand how delete functionality works across both the front end and backend. 
                The most important part was making sure the UI updates immediately without refreshing the page
                and handling errors properly. </p>
                
            </div>


        </div>
    );
}