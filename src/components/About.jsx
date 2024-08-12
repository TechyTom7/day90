import NavBar from "./NavBar";
import Contents from "./Contents";
import consts from "../consts";

export default function Home() {
    return (
        <div id='about-container'>
            <NavBar current={"about"}/>
            <div id="about-inner-container"> {/* grid with 1fr 3fr */}
                {/* table of contents here */}
                <Contents/>
                <div id='about-info-container'>
                    <h2 id="EU-rule">A bit about the 90/180 rule</h2>
                    <p>The 90/180-day rule is a regulation applied to non-EU nationals traveling within the Schengen Area,
                        a group of 27 European countries that have abolished passport and other types of border controls at
                        their mutual borders. According to this rule, non-EU visitors can stay in the Schengen Area for up
                        to 90 days within any 180-day period for purposes such as tourism, business, or visiting family and
                        friends, without needing a visa.
                        <br/><br/>
                        The calculation of the 90 days is based on the date of entry into and exit from the Schengen Area.
                        The 180-day period is a rolling timeframe, meaning each day of stay is counted against the previous
                        180 days. For instance, if a visitor spends 90 days consecutively in the Schengen Area, they must
                        leave and can only return after 90 days have passed.
                        <br/><br/>
                        This rule helps manage the flow of short-term visitors while preventing overstays, which could lead
                        to penalties such as fines, deportation, or future entry bans. It's essential for travelers to keep
                        track of their days in the Schengen Area to avoid unintentional violations. The rule does not apply
                        to EU citizens or those with long-term visas or residence permits issued by a Schengen country.
                    </p>
                    <h2 id="eu-planner-heading">The EU planner</h2>
                    <p> Many people struggle with keeping up with all the new dates, and using that data to decide if they
                        can stay in that country, and it just becomes a hassle. This is where the planner comes in. What
                        makes it so special, is that it makes it way easier to plan your stay at an EU country.
                    </p>
                    <h2 id='how-it-works'>How it works</h2>
                    <p>This section will cover the basics on how to flawlessly use our provided schedule planner. To go
                        to the planner (if you purchased the subscription), simply click on the planner link at the navigation
                        on top of this page.
                    </p>
                    <p>
                        Now what you'll see might be a bit menacing, however it's actually very simple! You will see
                        a calendar with a 180 day range, 90 days before and after the current date. You will see the current date in a
                        light red circle.
                    </p>
                    <p>
                        Before we move on, we have to select the days we were in an EU country. To do that, simply click
                        on the date you were in the country. The button to click is circular, and contains the day in the 180 day
                        range calendar. For now the date has to be before or the current date of whenever you're using this tool.
                    </p>
                    <p>
                        If you've selected a wrong date, simply click on that date again to remove that date. Also keep in
                        mind that the selected dates will show a green colour. If the current date is selected (which
                        should mean that you are in that country right now) will show a light green colour.
                    </p>
                    <p>
                        Now we have selected the days we were in the EU country, we can now take a look at the text above
                        the calendar. The text above basically shows how many days we have left to schedule based on the
                        previous dates we have been in the EU country. According to the EU regulations, the amount of days
                        selected in our unique calendar should not exceed 90. It will automatically warn you that you can't
                        schedule more days, or that you have tried to schedule too many days.
                    </p>
                    <p>
                        With this basic guide, you should be able to master the skills of using the EU tool we have provided
                        for you! Of course we will keep implementing new features as time goes. We hope you will find it
                        way easier to manage your stay in an EU country!
                    </p>
                </div>
            </div>
        </div>
    )
}
