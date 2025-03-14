import dayjs from 'dayjs';
import AvgDeliveryTime from '@/shared/logistics/dashboard/avg-delivery-time';
import ComplaintRate from '@/shared/logistics/dashboard/complaint-rate';
import ComplaintReason from '@/shared/logistics/dashboard/complaint-reason';
import { DeliveryStatus } from '@/shared/logistics/dashboard/delivery-status';
import DispatchPlanning from '@/shared/logistics/dashboard/dispatch-planning';
import FleetStatus from '@/shared/logistics/dashboard/fleet-status';
import LoadingWorkflow from '@/shared/logistics/dashboard/loading-workflow';
import OpenSalesOrder from '@/shared/logistics/dashboard/open-sales-order';
import ProfitChart from '@/shared/logistics/dashboard/profit';
import StatCards from '@/shared/logistics/dashboard/stat-cards';
import TopCustomer from '@/shared/logistics/dashboard/top-customer';
import TopShipmentCountries from '@/shared/logistics/dashboard/top-shipment-countries';
import ShipmentTableWidget from '@/shared/logistics/dashboard/shipment-table';

const thisMonth = dayjs(new Date()).format('MMMM YYYY');

export default function LogisticsDashboard() {
  return (
    <div className="@container">
      <div className="grid grid-cols-12 gap-6 3xl:gap-8">
        <StatCards className="col-span-full" />

        <OpenSalesOrder className="col-span-full @3xl:col-span-6 @[1429px]:col-span-4" />
        <DispatchPlanning className="col-span-full @3xl:col-span-6 @[1429px]:col-span-4" />
        <LoadingWorkflow className="col-span-full @3xl:col-span-6 @[1429px]:col-span-4" />

        <FleetStatus className="col-span-full @3xl:col-span-6 @[1429px]:col-span-4" />
        <ProfitChart className="col-span-full @3xl:col-span-full @[1429px]:col-span-8" />

        <ShipmentTableWidget
          title="Pending Shipments"
          description={`Summary of pending shipments of ${thisMonth}`}
          className="col-span-full"
        />

        <DeliveryStatus className="col-span-full" />

        <AvgDeliveryTime className="col-span-full @4xl:col-span-6 @7xl:col-span-4" />
        <ComplaintRate className="col-span-full @4xl:col-span-6 @7xl:col-span-4" />
        <ComplaintReason className="col-span-full @4xl:col-span-6 @7xl:col-span-4 @7xl:[&_.recharts-responsive-container]:!w-11/12 @[88rem]:[&_.recharts-responsive-container]:!w-full" />
        <TopShipmentCountries className="col-span-full @4xl:col-span-6 @7xl:col-span-4 @7xl:[&_.recharts-responsive-container]:!w-11/12 @[88rem]:[&_.recharts-responsive-container]:!w-full" />

        <TopCustomer className="col-span-full @3xl:col-span-full @5xl:col-span-full @7xl:col-span-8" />

        <ShipmentTableWidget
          title="Recent Shipments"
          description={`Summary of recent shipments of ${thisMonth}`}
          className="col-span-full"
        />
      </div>
    </div>
  );
}
