import AppointmentStats from '@/shared/appointment/dashboard/appointment-stats';
import UpcomingAppointmentTable from '@/shared/appointment/dashboard/upcoming-appointment-table';
import AppointmentDiseases from '@/shared/appointment/dashboard/appointment-diseases';
import Department from '@/shared/appointment/dashboard/department';
import TotalAppointment from '@/shared/appointment/dashboard/total-appointment';
import Patients from '@/shared/appointment/dashboard/patients';
import PatientAppointment from '@/shared/appointment/dashboard/patient-appointment';
import ScheduleList from '@/shared/appointment/dashboard/schedule-list';
import AppointmentTodo from '@/shared/appointment/dashboard/appointment-todo';

export default function AppointmentDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6 @container @[59rem]:gap-7 3xl:gap-8">
      <AppointmentStats className="col-span-full" />
      <TotalAppointment className="col-span-full @[90rem]:col-span-7" />
      <ScheduleList className="col-span-full @[59rem]:col-span-6 @[90rem]:col-span-5" />
      <AppointmentTodo className="col-span-full @[59rem]:col-span-6 @[90rem]:col-span-4" />
      <Patients className="col-span-full @[59rem]:col-span-6 @[90rem]:col-span-4" />
      <Department className="col-span-full @[59rem]:col-span-6 @[90rem]:col-span-4" />
      <UpcomingAppointmentTable className="col-span-full" />
      <PatientAppointment className="col-span-full @[59rem]:col-span-6 @[90rem]:col-span-7 @[90rem]:col-start-auto @[90rem]:row-start-auto" />
      <AppointmentDiseases className="col-span-full @[59rem]:col-span-6 @[90rem]:col-span-5" />
    </div>
  );
}
