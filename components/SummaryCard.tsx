import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

type BookingDataProps = {
  guests: number;
  date: Date;
  time: string;
  name: string;
  phone: string;
  email: string;
  restaurantName: string;
  onClick?: () => void;
};

const SummaryCard = ({
  guests,
  date,
  time,
  name,
  phone,
  email,
  restaurantName,
  onClick,
}: BookingDataProps) => {
  return (
    <Card className="w-[350px] sm:w-[450px] bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-900 font-bold shadow-xl ">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{restaurantName}</h2>
          <div className="flex items-center bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Confirmed
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>Guests</span>
            </div>
            <span className="font-semibold">{guests}</span>
          </div>
          <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Date</span>
            </div>
            <span className="font-semibold">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Time</span>
            </div>
            <span className="font-semibold">{time}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Booking Details</h3>
          <p className="flex items-center">
            <span className="font-medium mr-2">Name:</span> {name}
          </p>
          <p className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            {phone}
          </p>
          <p className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            {email}
          </p>
        </div>
        <div className="bg-emerald-200 p-3 rounded-lg text-center">
          <p className="text-sm">Booking Reference</p>
          <p className="text-lg font-bold">12345</p>
        </div>
      </div>
      <CardFooter className="bg-emerald-200">
        <Button
          className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={onClick}
        >
          Make Another Reservation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryCard;
