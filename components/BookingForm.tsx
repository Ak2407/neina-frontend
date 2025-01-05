"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { cn } from "@/lib/utils";
import SummaryCard from "./SummaryCard";

type BookingData = {
  guests: number;
  date: Date | undefined;
  time: string;
  name: string;
  phone: string;
  email: string;
};

const initialBookingData: BookingData = {
  guests: 1,
  date: undefined,
  time: "",
  name: "",
  phone: "",
  email: "",
};

const timeSlots = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

export default function BookingForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] =
    useState<BookingData>(initialBookingData);
  const [disabledTimeSlots, setDisabledTimeSlots] = useState<
    Record<string, string[]>
  >({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const fetchAvailableTimeSlots = async (selectedDate: Date) => {
    try {
      setIsLoadingSlots(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/booking/available-slots/${formattedDate}`
      );

      const { bookedTimeSlots } = response.data;
      const newDisabledTimeSlots = {
        [formattedDate]: bookedTimeSlots,
      };

      setDisabledTimeSlots(newDisabledTimeSlots);
    } catch (error) {
      console.error("Error fetching available time slots:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setBookingData({ ...bookingData, date, time: "" });
    if (date) {
      fetchAvailableTimeSlots(date);
    }
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nextDay = new Date(bookingData.date!);
      nextDay.setDate(nextDay.getDate() + 1);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/booking/create`,
        {
          bookingData: {
            ...bookingData,
            date: nextDay.toISOString(),
          },
        }
      );

      setStep(2);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setBookingData(initialBookingData);
    setStep(0);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="flex justify-center items-center p-4">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="w-[350px] sm:w-[450px] ">
              <CardHeader>
                <CardTitle>Select Guests, Date and Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    name="guests"
                    type="number"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div className="space-y-2  ">
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={bookingData.date}
                    onSelect={handleDateSelect}
                    disabled={isLoadingSlots}
                    className={cn(
                      "rounded-md border flex items-center justify-evenly",
                      isLoadingSlots && "opacity-50 cursor-not-allowed"
                    )}
                  />
                </div>
                {bookingData.date && (
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {isLoadingSlots ? (
                        <div className="col-span-3 text-center text-muted-foreground">
                          Loading available slots...
                        </div>
                      ) : (
                        timeSlots.map((slot) => {
                          const isDisabled =
                            disabledTimeSlots[
                              format(bookingData.date!, "yyyy-MM-dd")
                            ]?.includes(slot);
                          return (
                            <Button
                              key={slot}
                              variant={
                                bookingData.time === slot
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => handleTimeSelect(slot)}
                              disabled={isDisabled}
                              className={isDisabled ? "opacity-50" : ""}
                            >
                              {slot}
                            </Button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => setStep(1)}
                  disabled={
                    !bookingData.guests ||
                    !bookingData.date ||
                    !bookingData.time
                  }
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="w-[350px] sm:w-[450px] ">
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-500">
                  {bookingData.guests} guests on{" "}
                  {bookingData.date && format(bookingData.date, "MMMM d, yyyy")}{" "}
                  at {bookingData.time}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={bookingData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !bookingData.name ||
                    !bookingData.phone ||
                    !bookingData.email ||
                    loading
                  }
                >
                  {loading ? "Booking..." : "Book"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <SummaryCard
              guests={bookingData.guests}
              date={bookingData.date}
              time={bookingData.time}
              name={bookingData.name}
              phone={bookingData.phone}
              email={bookingData.email}
              onClick={resetBooking}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
