import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Calculator, DollarSign, Home, Snowflake, Flame } from 'lucide-react';
import { calculateEstimate } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const CostEstimatorPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    squareFootage: '',
    systemType: '',
    homeAge: '',
    currentSystem: '',
    urgency: ''
  });
  const [estimate, setEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const result = await calculateEstimate(formData);
      setEstimate(result);
      toast({
        title: "Estimate Calculated!",
        description: "Your personalized HVAC cost estimate is ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to calculate estimate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HVAC Cost Estimator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get an instant estimate for your HVAC installation or replacement. 
            Our calculator uses industry standards and local pricing data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Estimator Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                System Information
              </CardTitle>
              <CardDescription>
                Fill out the details below for your personalized estimate
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleCalculate} className="space-y-6">
                
                {/* Square Footage */}
                <div className="space-y-2">
                  <Label htmlFor="squareFootage" className="text-sm font-medium flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-500" />
                    Home Square Footage *
                  </Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                    required
                    className="h-12"
                    placeholder="e.g. 2000"
                  />
                </div>

                {/* System Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    System Type *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('systemType', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select system type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="central-air">Central Air & Gas Furnace</SelectItem>
                      <SelectItem value="heat-pump">Heat Pump System</SelectItem>
                      <SelectItem value="gas-furnace">Gas Furnace Only</SelectItem>
                      <SelectItem value="electric-heat">Electric Heat & AC</SelectItem>
                      <SelectItem value="ductless">Ductless Mini-Split</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Home Age */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Home Age
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('homeAge', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select home age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Less than 5 years</SelectItem>
                      <SelectItem value="recent">5-15 years</SelectItem>
                      <SelectItem value="older">15-30 years</SelectItem>
                      <SelectItem value="very-old">30+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Current System */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Current System Condition
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('currentSystem', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select current condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-install">New Installation</SelectItem>
                      <SelectItem value="working">Working but old</SelectItem>
                      <SelectItem value="repair-needed">Needs major repair</SelectItem>
                      <SelectItem value="broken">Not working</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Installation Timeline
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="When do you need installation?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="urgent">Within 1 week</SelectItem>
                      <SelectItem value="soon">Within 1 month</SelectItem>
                      <SelectItem value="planning">Planning for future</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isCalculating || !formData.squareFootage || !formData.systemType}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg"
                >
                  {isCalculating ? "Calculating..." : "Get My Estimate"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {estimate ? (
              <>
                <Card className="shadow-xl border-0">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="text-2xl flex items-center gap-2 text-green-800">
                      <DollarSign className="w-6 h-6" />
                      Your Estimate
                    </CardTitle>
                    <CardDescription>
                      Estimated cost for your HVAC system
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          ${estimate.recommended.toLocaleString()}
                        </div>
                        <div className="text-gray-600">
                          Recommended System Cost
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Range: ${estimate.lowEstimate.toLocaleString()} - ${estimate.highEstimate.toLocaleString()}
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-4">Factors Affecting Your Price:</h3>
                        <ul className="space-y-2">
                          {estimate.factors.map((factor, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> This is an estimated price range. 
                          Final pricing may vary based on site conditions, local codes, 
                          and specific equipment selection.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                        Schedule Free In-Home Assessment
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        Speak with HVAC Expert
                      </Button>
                      <div className="text-center text-sm text-gray-600">
                        Get a precise quote with our free, no-obligation consultation
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-xl border-0">
                <CardContent className="p-12 text-center">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Ready to Calculate?
                  </h3>
                  <p className="text-gray-500">
                    Fill out the form to get your personalized HVAC cost estimate
                  </p>
                </CardContent>
              </Card>
            )}

            {/* System Types Info */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">System Type Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Snowflake className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <div className="font-medium">Heat Pump</div>
                    <div className="text-sm text-gray-600">
                      Efficient heating & cooling in one unit
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Flame className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <div className="font-medium">Gas Furnace + AC</div>
                    <div className="text-sm text-gray-600">
                      Traditional separate heating & cooling
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimatorPage;