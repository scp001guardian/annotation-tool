import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr;
  gap: 20px;
  height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ImageSection = styled.div`
  grid-row: 1;
  grid-column: 1;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const SidePanel = styled.div`
  grid-row: 1;
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InstructionsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

const UserInputSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ComponentItem = styled.div`
  padding: 10px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UndoButton = styled(Button)`
  background-color: #dc3545;
  margin-left: 10px;

  &:hover {
    background-color: #c82333;
  }
`;

const CurrentItem = styled.div`
  background-color: #e3f2fd;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 3px solid #2196f3;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.2);
  transform: scale(1.02);
  transition: all 0.2s ease-in-out;
`;

const CurrentItemTitle = styled.h4`
  color: #000000;
  margin: 0 0 15px 0;
  font-size: 1.2em;
  font-weight: 600;
`;

const CurrentItemContent = styled.div`
  font-size: 1.4em;
  font-weight: 700;
  color: #000000;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
`;

interface Component {
  name: string;
  size?: 'Very Large' | 'Large' | 'Medium' | 'Small' | 'Very Small';
  frequency?: 'Constant' | 'Frequent' | 'Occasional' | 'Rare' | 'Emergency';
}

interface SizeEntry {
  source: string;
  target: string;
  size: string;
  frequency?: string;
  distance?: string;
  spatial?: string;
}

interface ProximityEntry {
  target: string;
  proximity: string;
}

interface SpatialEntry {
  target: string;
  spatialRelation: string;
}

interface LegendItem {
  id: number;
  text: string;
  size: string;
  frequency: string;
  relationships: {
    target: string;
    proximity: string;
    significance: number;
    position: string;
  }[];
}

function App() {
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [userName, setUserName] = useState('');
  const [labeledComponents, setLabeledComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeEntries, setSizeEntries] = useState<SizeEntry[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [selectedDistance, setSelectedDistance] = useState<string>('');
  const [selectedSpatial, setSelectedSpatial] = useState<string>('');
  const [sizeComponentIndex, setSizeComponentIndex] = useState(0);
  const [frequencyComponentIndex, setFrequencyComponentIndex] = useState(0);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(1);
  const [componentSizes, setComponentSizes] = useState<Record<string, string>>({});
  const [componentFrequencies, setComponentFrequencies] = useState<Record<string, string>>({});
  const [componentProximities, setComponentProximities] = useState<Record<string, ProximityEntry[]>>({});
  const [spatialSourceIndex, setSpatialSourceIndex] = useState(0);
  const [spatialTargetIndex, setSpatialTargetIndex] = useState(1);
  const [componentSpatialRelations, setComponentSpatialRelations] = useState<Record<string, SpatialEntry[]>>({});

  useEffect(() => {
    // Load labeled components from JSON file
    fetch('/legend_components_1.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.components && Array.isArray(data.components)) {
          const components = data.components.map((name: string) => ({ name }));
          setLabeledComponents(components);
          // Initialize size and frequency objects with empty values
          const initialSizes: Record<string, string> = {};
          const initialFrequencies: Record<string, string> = {};
          const initialProximities: Record<string, ProximityEntry[]> = {};
          const initialSpatialRelations: Record<string, SpatialEntry[]> = {};
          components.forEach((comp: Component) => {
            initialSizes[comp.name] = '';
            initialFrequencies[comp.name] = '';
            initialProximities[comp.name] = [];
            initialSpatialRelations[comp.name] = [];
          });
          setComponentSizes(initialSizes);
          setComponentFrequencies(initialFrequencies);
          setComponentProximities(initialProximities);
          setComponentSpatialRelations(initialSpatialRelations);

          // Set the first component as selected for both stages
          if (components.length > 0) {
            setSelectedComponent(components[0].name);
          }
        } else {
          console.error('Invalid JSON data format');
        }
      })
      .catch(error => console.error('Error loading labeled components:', error));
  }, []);

  const allComponents = labeledComponents;

  const getNextSizeComponent = () => {
    if (sizeComponentIndex < allComponents.length - 1) {
      setSizeComponentIndex(sizeComponentIndex + 1);
      setSelectedComponent(allComponents[sizeComponentIndex + 1].name);
      setSelectedSize('');
    }
  };

  const getNextFrequencyComponent = () => {
    if (frequencyComponentIndex < allComponents.length - 1) {
      setFrequencyComponentIndex(frequencyComponentIndex + 1);
      setSelectedComponent(allComponents[frequencyComponentIndex + 1].name);
      setSelectedFrequency('');
    }
  };

  const handleSaveSize = () => {
    if (selectedComponent && selectedSize) {
      // Update the size in componentSizes
      setComponentSizes(prev => ({
        ...prev,
        [selectedComponent]: selectedSize
      }));

      // Also update labeledComponents for consistency
      setLabeledComponents(prevComponents => 
        prevComponents.map(c => 
          c.name === selectedComponent ? { ...c, size: selectedSize as Component['size'] } : c
        )
      );

      // Reset selections
      setSelectedComponent('');
      setSelectedSize('');
    }
  };

  const handleSaveFrequency = () => {
    if (selectedComponent && selectedFrequency) {
      // Update the frequency in componentFrequencies
      setComponentFrequencies(prev => ({
        ...prev,
        [selectedComponent]: selectedFrequency
      }));

      // Also update labeledComponents for consistency
      setLabeledComponents(prevComponents => 
        prevComponents.map(c => 
          c.name === selectedComponent ? { ...c, frequency: selectedFrequency as Component['frequency'] } : c
        )
      );

      // Reset selections
      setSelectedComponent('');
      setSelectedFrequency('');
    }
  };

  const handleSaveProximity = () => {
    if (selectedComponent && selectedTarget && selectedDistance) {
      // Add proximity for source -> target
      setComponentProximities(prev => ({
        ...prev,
        [selectedComponent]: [
          ...prev[selectedComponent],
          { target: selectedTarget, proximity: selectedDistance }
        ]
      }));

      // Add proximity for target -> source
      setComponentProximities(prev => ({
        ...prev,
        [selectedTarget]: [
          ...prev[selectedTarget],
          { target: selectedComponent, proximity: selectedDistance }
        ]
      }));

      // Reset selections
      setSelectedTarget('');
      setSelectedDistance('');
    }
  };

  const handleSaveSpatial = () => {
    if (selectedComponent && selectedTarget && selectedSpatial) {
      const oppositeSpatial = getOppositeSpatial(selectedSpatial);

      // Add spatial relation for source -> target
      setComponentSpatialRelations(prev => ({
        ...prev,
        [selectedComponent]: [
          ...prev[selectedComponent],
          { target: selectedTarget, spatialRelation: selectedSpatial }
        ]
      }));

      // Add opposite spatial relation for target -> source
      setComponentSpatialRelations(prev => ({
        ...prev,
        [selectedTarget]: [
          ...prev[selectedTarget],
          { target: selectedComponent, spatialRelation: oppositeSpatial }
        ]
      }));

      // Reset selections
      setSelectedTarget('');
      setSelectedSpatial('');
    }
  };

  const getNextProximityPair = () => {
    if (currentSourceIndex < allComponents.length - 1) {
      if (currentTargetIndex < allComponents.length - 1) {
        setCurrentTargetIndex(currentTargetIndex + 1);
        setSelectedTarget(allComponents[currentTargetIndex + 1].name);
      } else {
        setCurrentSourceIndex(currentSourceIndex + 1);
        setCurrentTargetIndex(currentSourceIndex + 2);
        setSelectedComponent(allComponents[currentSourceIndex + 1].name);
        setSelectedTarget(allComponents[currentSourceIndex + 2].name);
      }
    }
  };

  const getAvailableTargets = () => {
    // Get all components that don't have a relationship with the selected source
    return allComponents.filter(comp => {
      if (comp.name === selectedComponent) return false;
      
      // Check if this component already has a relationship with the source (in either direction)
      return !sizeEntries.some(entry => 
        (entry.source === selectedComponent && entry.target === comp.name) ||
        (entry.source === comp.name && entry.target === selectedComponent)
      );
    });
  };

  const getOppositeSpatial = (spatial: string): string => {
    const opposites: { [key: string]: string } = {
      'Above': 'Below',
      'Below': 'Above',
      'Left': 'Right',
      'Right': 'Left',
      'Above-Left': 'Below-Right',
      'Above-Right': 'Below-Left',
      'Below-Left': 'Above-Right',
      'Below-Right': 'Above-Left'
    };
    return opposites[spatial] || spatial;
  };

  const getNextSpatialPair = () => {
    if (spatialSourceIndex < allComponents.length - 1) {
      if (spatialTargetIndex < allComponents.length - 1) {
        setSpatialTargetIndex(spatialTargetIndex + 1);
        setSelectedTarget(allComponents[spatialTargetIndex + 1].name);
      } else {
        setSpatialSourceIndex(spatialSourceIndex + 1);
        setSpatialTargetIndex(spatialSourceIndex + 2);
        setSelectedComponent(allComponents[spatialSourceIndex + 1].name);
        setSelectedTarget(allComponents[spatialSourceIndex + 2].name);
      }
    }
  };

  const getNextRelationship = () => {
    if (currentSourceIndex < allComponents.length - 1) {
      if (currentTargetIndex < allComponents.length - 1) {
        setCurrentTargetIndex(currentTargetIndex + 1);
        setSelectedTarget(allComponents[currentTargetIndex + 1].name);
        setSelectedDistance('');
        setSelectedSpatial('');
      } else {
        setCurrentSourceIndex(currentSourceIndex + 1);
        setCurrentTargetIndex(currentSourceIndex + 2);
        setSelectedComponent(allComponents[currentSourceIndex + 1].name);
        setSelectedTarget(allComponents[currentSourceIndex + 2].name);
        setSelectedDistance('');
        setSelectedSpatial('');
      }
    }
  };

  const generateLegendJson = () => {
    const legendItems: LegendItem[] = allComponents.map((comp, index) => {
      // Get all relationships for this component
      const relationships = allComponents
        .filter(target => target.name !== comp.name)
        .map(target => {
          // Find proximity and spatial relation from our stored data
          const proximityEntry = componentProximities[comp.name]?.find(entry => entry.target === target.name);
          const spatialEntry = componentSpatialRelations[comp.name]?.find(entry => entry.target === target.name);

          return {
            target: target.name,
            proximity: proximityEntry?.proximity || "UNKNOWN",
            significance: 0.5,
            position: spatialEntry?.spatialRelation || "UNKNOWN"
          };
        });

      return {
        id: index + 1,
        text: comp.name,
        size: componentSizes[comp.name] || "UNKNOWN",
        frequency: componentFrequencies[comp.name] || "UNKNOWN",
        relationships
      };
    });

    const jsonData = {
      legend_items: legendItems
    };

    // Create a blob and download link
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legend_annotations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStage2 = () => {
    const isLastComponent = sizeComponentIndex === allComponents.length - 1;
    const allComponentsSized = Object.values(componentSizes).every(size => size !== '');

    return (
      <>
        <InstructionsSection>
          <h2>Task Instructions</h2>
          <h3>Stage 1: Categorize Component Sizes</h3>
          <ol>
            <li>For each component, determine its relative size within the dashboard.</li>
            <li>The components will be presented one by one in a fixed order.</li>
            <li>Choose the size from the dropdown for the current component.</li>
            <li>Click "Save Size" to record your selection and move to the next component.</li>
          </ol>
        </InstructionsSection>

        <UserInputSection>
          <h3>Size Categorization</h3>
          <div style={{ marginBottom: '20px' }}>
            <CurrentItem>
              <CurrentItemTitle>Current Component</CurrentItemTitle>
              <CurrentItemContent>{allComponents[sizeComponentIndex]?.name || 'None'}</CurrentItemContent>
            </CurrentItem>
            <h4>Select Size</h4>
            <Select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Choose a size</option>
              <option value="Very Large">Very Large</option>
              <option value="Large">Large</option>
              <option value="Medium">Medium</option>
              <option value="Small">Small</option>
              <option value="Very Small">Very Small</option>
            </Select>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button 
                onClick={() => {
                  if (isLastComponent && allComponentsSized) {
                    setStage(2);
                    setSelectedComponent(allComponents[0].name);
                  } else {
                    handleSaveSize();
                    getNextSizeComponent();
                  }
                }}
                disabled={!selectedSize}
              >
                {isLastComponent && allComponentsSized ? 'Proceed to Stage 2' : 'Save Size and Continue'}
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>Progress: {sizeComponentIndex + 1} of {allComponents.length} components</h4>
            <h4>Sized Components:</h4>
            <ul>
              {Object.entries(componentSizes)
                .filter(([_, size]) => size !== '')
                .map(([name, size], index) => (
                  <li key={index}>{name}: {size}</li>
                ))}
            </ul>
          </div>

          <Button 
            onClick={() => {
              setStage(2);
              setSelectedComponent(allComponents[0].name);
            }}
            style={{ backgroundColor: '#28a745', marginTop: '20px' }}
          >
            Proceed to Stage 2
          </Button>
        </UserInputSection>
      </>
    );
  };

  const renderStage3 = () => {
    const isLastComponent = frequencyComponentIndex === allComponents.length - 1;
    const allComponentsFrequencied = Object.values(componentFrequencies).every(freq => freq !== '');

    return (
      <>
        <InstructionsSection>
          <h2>Task Instructions</h2>
          <h3>Stage 2: Annotate Component Usage Frequency</h3>
          <ol>
            <li>Consider how frequently each component is likely used by a driver.</li>
            <li>The components will be presented one by one in a fixed order.</li>
            <li>Choose the frequency from the dropdown for the current component.</li>
            <li>Click "Save Frequency" to record your selection and move to the next component.</li>
          </ol>
        </InstructionsSection>

        <UserInputSection>
          <h3>Frequency Annotation</h3>
          <Button 
            onClick={() => {
              setStage(1);
              setSelectedComponent(allComponents[sizeComponentIndex].name);
            }}
            style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}
          >
            Back to Stage 1
          </Button>

          <div style={{ marginBottom: '20px' }}>
            <CurrentItem>
              <CurrentItemTitle>Current Component</CurrentItemTitle>
              <CurrentItemContent>{allComponents[frequencyComponentIndex]?.name || 'None'}</CurrentItemContent>
            </CurrentItem>
            <h4>Select Frequency</h4>
            <Select
              value={selectedFrequency}
              onChange={(e) => setSelectedFrequency(e.target.value)}
            >
              <option value="">Choose frequency</option>
              <option value="Constant">Constant</option>
              <option value="Frequent">Frequent</option>
              <option value="Occasional">Occasional</option>
              <option value="Rare">Rare</option>
              <option value="Emergency">Emergency</option>
            </Select>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button 
                onClick={() => {
                  if (isLastComponent && allComponentsFrequencied) {
                    setStage(3);
                    setSelectedComponent(allComponents[0].name);
                    setSelectedTarget(allComponents[1].name);
                  } else {
                    handleSaveFrequency();
                    getNextFrequencyComponent();
                  }
                }}
                disabled={!selectedFrequency}
              >
                {isLastComponent && allComponentsFrequencied ? 'Proceed to Stage 3' : 'Save Frequency and Continue'}
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>Progress: {frequencyComponentIndex + 1} of {allComponents.length} components</h4>
            <h4>Annotated Components:</h4>
            <ul>
              {Object.entries(componentFrequencies)
                .filter(([_, freq]) => freq !== '')
                .map(([name, freq], index) => (
                  <li key={index}>{name}: {freq}</li>
                ))}
            </ul>
          </div>

          <Button 
            onClick={() => {
              setStage(3);
              setSelectedComponent(allComponents[0].name);
              setSelectedTarget(allComponents[1].name);
            }}
            style={{ backgroundColor: '#28a745', marginTop: '20px' }}
          >
            Proceed to Stage 3
          </Button>
        </UserInputSection>
      </>
    );
  };

  const renderStage4 = () => {
    const isLastPair = currentSourceIndex === allComponents.length - 2 && 
                      currentTargetIndex === allComponents.length - 1;
    const allPairsAnnotated = Object.values(componentProximities).every(entries => 
      entries.length === allComponents.length - 1
    );

    return (
      <>
        <InstructionsSection>
          <h2>Task Instructions</h2>
          <h3>Stage 3: Identify Proximity Between Components</h3>
          <ol>
            <li>For each pair of components, determine their relative distance in the dashboard.</li>
            <li>Component pairs will be presented one by one in a fixed order.</li>
            <li>Choose the proximity level from the dropdown for the current pair.</li>
            <li>Click "Save Proximity" to record your selection and move to the next pair.</li>
            <li><strong>Note:</strong> The system will automatically handle the reverse relationship.</li>
          </ol>
        </InstructionsSection>

        <UserInputSection>
          <h3>Proximity Annotation</h3>
          <Button 
            onClick={() => {
              setStage(2);
              setSelectedComponent(allComponents[frequencyComponentIndex].name);
            }}
            style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}
          >
            Back to Stage 2
          </Button>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '1.4em', fontWeight: 700, marginBottom: '15px' }}>
              The proximity of <span style={{ fontWeight: 800, color: '#1976d2' }}>{allComponents[currentSourceIndex]?.name || 'None'}</span> and <span style={{ fontWeight: 800, color: '#1976d2' }}>{allComponents[currentTargetIndex]?.name || 'None'}</span> is:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Select
                value={selectedDistance}
                onChange={(e) => setSelectedDistance(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">Choose proximity</option>
                <option value="Adjacent">Adjacent</option>
                <option value="Close">Close</option>
                <option value="Moderate">Moderate</option>
                <option value="Far">Far</option>
                <option value="Very Far">Very Far</option>
              </Select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button 
                onClick={() => {
                  if (isLastPair && allPairsAnnotated) {
                    setStage(4);
                    setSelectedComponent(allComponents[0].name);
                    setSelectedTarget(allComponents[1].name);
                    setSpatialSourceIndex(0);
                    setSpatialTargetIndex(1);
                  } else {
                    handleSaveProximity();
                    getNextProximityPair();
                  }
                }}
                disabled={!selectedDistance}
              >
                {isLastPair && allPairsAnnotated ? 'Proceed to Stage 4' : 'Save Proximity and Continue'}
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>Progress: {currentSourceIndex + 1} of {allComponents.length - 1} source components</h4>
            <h4>Annotated Proximities:</h4>
            <ul>
              {Object.entries(componentProximities)
                .map(([source, entries]) => 
                  entries.map((entry, index) => (
                    <li key={`${source}-${entry.target}-${index}`}>
                      {source} → {entry.target} ({entry.proximity})
                    </li>
                  ))
                )}
            </ul>
          </div>

          <Button 
            onClick={() => {
              setStage(4);
              setSelectedComponent(allComponents[0].name);
              setSelectedTarget(allComponents[1].name);
              setSpatialSourceIndex(0);
              setSpatialTargetIndex(1);
            }}
            style={{ backgroundColor: '#28a745', marginTop: '20px' }}
          >
            Proceed to Stage 4
          </Button>
        </UserInputSection>
      </>
    );
  };

  const renderStage5 = () => {
    const isLastPair = spatialSourceIndex === allComponents.length - 2 && 
                      spatialTargetIndex === allComponents.length - 1;
    const allPairsAnnotated = Object.values(componentSpatialRelations).every(entries => 
      entries.length === allComponents.length - 1
    );

    return (
      <>
        <InstructionsSection>
          <h2>Task Instructions</h2>
          <h3>Stage 4: Determine Detailed Spatial Relationships</h3>
          <ol>
            <li>For each component pair, specify the exact directional relationship from the source component's perspective.</li>
            <li>Component pairs will be presented one by one in a fixed order.</li>
            <li>Choose the spatial relationship from the dropdown for the current pair.</li>
            <li>Click "Save Spatial Relationship" to record your selection and move to the next pair.</li>
            <li><strong>Note:</strong> The system will automatically record the opposite relationship for the target component.</li>
          </ol>
        </InstructionsSection>

        <UserInputSection>
          <h3>Spatial Relationship Annotation</h3>
          <Button 
            onClick={() => {
              setStage(3);
              setSelectedComponent(allComponents[currentSourceIndex].name);
              setSelectedTarget(allComponents[currentTargetIndex].name);
            }}
            style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}
          >
            Back to Stage 3
          </Button>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '1.4em', fontWeight: 700, marginBottom: '15px' }}>
              Identify spatial relations: <span style={{ fontWeight: 800, color: '#1976d2' }}>{allComponents[spatialTargetIndex]?.name || 'None'}</span> is:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Select
                value={selectedSpatial}
                onChange={(e) => setSelectedSpatial(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">Choose spatial relationship</option>
                <option value="Above">Above</option>
                <option value="Below">Below</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
                <option value="Above-Left">Above-Left</option>
                <option value="Above-Right">Above-Right</option>
                <option value="Below-Left">Below-Left</option>
                <option value="Below-Right">Below-Right</option>
              </Select>
              <span style={{ marginLeft: '5px', fontSize: '1.4em', fontWeight: 700 }}>of <span style={{ fontWeight: 800, color: '#1976d2' }}>{allComponents[spatialSourceIndex]?.name || 'None'}</span></span>
            </div>

            <Button 
              onClick={() => {
                if (isLastPair && allPairsAnnotated) {
                  setStage(5);
                } else {
                  handleSaveSpatial();
                  getNextSpatialPair();
                }
              }}
              disabled={!selectedSpatial}
              style={{ marginTop: '10px' }}
            >
              {isLastPair && allPairsAnnotated ? 'Proceed to Stage 5' : 'Save Spatial Relationship and Continue'}
            </Button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>Progress: {spatialSourceIndex + 1} of {allComponents.length - 1} source components</h4>
            <h4>Annotated Spatial Relationships:</h4>
            <ul>
              {Object.entries(componentSpatialRelations)
                .map(([source, entries]) => 
                  entries.map((entry, index) => (
                    <li key={`${source}-${entry.target}-${index}`}>
                      {source} → {entry.target} ({entry.spatialRelation})
                    </li>
                  ))
                )}
            </ul>
          </div>

          <Button 
            onClick={generateLegendJson}
            style={{ 
              backgroundColor: '#28a745', 
              marginTop: '20px',
              width: '100%',
              padding: '15px',
              fontSize: '1.2em'
            }}
          >
            Export Current Annotations as JSON
          </Button>

          <Button 
            onClick={() => {
              setStage(5);
            }}
            style={{ backgroundColor: '#28a745', marginTop: '20px' }}
          >
            Proceed to Stage 5
          </Button>
        </UserInputSection>
      </>
    );
  };

  return (
    <AppContainer>
      <ImageSection>
        <img src="/1.png" alt="Car Dashboard" />
      </ImageSection>
      
      <SidePanel>
        {stage === 1 ? renderStage2() : stage === 2 ? renderStage3() : stage === 3 ? renderStage4() : renderStage5()}
      </SidePanel>
    </AppContainer>
  );
}

export default App; 