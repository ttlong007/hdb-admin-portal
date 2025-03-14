import cn from '@core/utils/class-names';
import StatsCards from '@/shared/executive/stats-cards';
import RevenueExpense from '@/shared/executive/revenue-expense';
import Forecast from '@/shared/executive/forecast';
import OperatingCashFlow from '@/shared/executive/operating-cash-flow';
import ArrBySignUp from '@/shared/executive/arr-by-signup';
import ActiveUsers from '@/shared/executive/active-users';
import MRRReport from '@/shared/executive/mrr-report';
import SocialFollowers from '@/shared/executive/social-followers';
import WebAnalytics from '@/shared/executive/web-analytics';
import BiggestDeal from '@/shared/executive/biggest-deal';
import RecentCustomers from '@/shared/executive/recent-customers';
import TotalProfitLoss from '@/shared/executive/total-profit-loss';
import MonthlySalesGrowth from '@/shared/executive/monthly-sales-growth';
import SalesByCategory from '@/shared/executive/sales-by-category';

export default function ExecutiveDashboard({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 @container 2xl:gap-x-6 2xl:gap-y-7 3xl:gap-8',
        className
      )}
    >
      <StatsCards />
      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-2 2xl:gap-x-6 2xl:gap-y-7 3xl:gap-8">
        <RevenueExpense />
        <Forecast />
      </div>
      <TotalProfitLoss />
      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-2 @7xl:grid-cols-4 2xl:gap-x-6 2xl:gap-y-7 3xl:gap-8">
        <MRRReport />
        <SocialFollowers />
        <WebAnalytics />
        <BiggestDeal />
      </div>
      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-2 2xl:gap-x-6 2xl:gap-y-7 3xl:gap-8">
        <SalesByCategory />
        <MonthlySalesGrowth />
      </div>
      <OperatingCashFlow />
      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-2 2xl:gap-x-6 2xl:gap-y-7 3xl:gap-8">
        <ArrBySignUp />
        <ActiveUsers />
      </div>
      <RecentCustomers />
    </div>
  );
}
