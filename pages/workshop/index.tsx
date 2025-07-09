import UpcomingWorkshops from "@/components/workshops";

export default function ShopYarn() {
    return (
        <div>
            <div className="container mx-auto p-4">
                <UpcomingWorkshops/>
                <UpcomingWorkshops/>
                <UpcomingWorkshops/>
                <hr className="border-t border-black my-6" />
      
            </div>
        </div>
    )
}