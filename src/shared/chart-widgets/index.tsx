import SimpleLineChart from '@/shared/chart-widgets/simple-line-chart';
import CustomizedDotLineChart from '@/shared/chart-widgets/customized-dot-line-chart';
import SimpleBarChart from '@/shared/chart-widgets/simple-bar-chart';
import MixBarChart from '@/shared/chart-widgets/mix-bar-chart';
import CustomShapeBarChart from '@/shared/chart-widgets/custom-shape-bar-chart';
import BrushBarChart from '@/shared/chart-widgets/brush-bar-chart';
import SimpleAreaChart from '@/shared/chart-widgets/simple-area-chart';
import StackedAreaChart from '@/shared/chart-widgets/stacked-area-chart';
import SimpleRadarChart from '@/shared/chart-widgets/simple-radar-chart';
import RadialBarChart from '@/shared/chart-widgets/radial-bar-chart';
import CustomizedMixChart from '@/shared/chart-widgets/customized-mix-chart';

export default function ChartWidgets() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 3xl:gap-8">
      <SimpleLineChart />
      <CustomizedDotLineChart />
      <SimpleBarChart />
      <MixBarChart />
      <CustomShapeBarChart />
      <BrushBarChart />
      <SimpleAreaChart />
      <StackedAreaChart />
      <SimpleRadarChart />
      <RadialBarChart />
      <CustomizedMixChart className="lg:col-span-2" />
    </div>
  );
}
