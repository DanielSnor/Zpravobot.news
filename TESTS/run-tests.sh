#!/bin/bash

###############################################################################
# IFTTT Webhook Filter v3.1.2 - Test Execution Script
# Quick and easy way to run all tests
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Print header
print_header() {
    echo -e "${BOLD}${BLUE}"
    echo "================================================================================"
    echo "$1"
    echo "================================================================================"
    echo -e "${NC}"
}

# Print subheader
print_subheader() {
    echo -e "${YELLOW}"
    echo "────────────────────────────────────────────────────────────────────────────────"
    echo "$1"
    echo "────────────────────────────────────────────────────────────────────────────────"
    echo -e "${NC}"
}

# Print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Print info
print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Main execution
main() {
    print_header "IFTTT Webhook Filter v3.1.2 - Test Execution"
    
    # Check if Node.js is available
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_info "Please install Node.js to run the tests."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_info "Node.js version: $NODE_VERSION"
    echo ""
    
    # Check if test runner exists
    if [ ! -f "test-runner-v3_1_2.js" ]; then
        print_error "Test runner not found: test-runner-v3_1_2.js"
        print_info "Make sure you're in the correct directory."
        exit 1
    fi
    
    print_subheader "Running v3.1.2 Critical Tests"
    echo ""
    
    # Run the tests
    node test-runner-v3_1_2.js
    TEST_EXIT_CODE=$?
    
    echo ""
    
    # Check results
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        print_header "Test Results: SUCCESS"
        print_success "All critical tests passed!"
        echo ""
        print_info "v3.1.2 is ready for beta testing"
        echo ""
        print_subheader "Next Steps"
        echo "1. Deploy to @betabot account for beta testing"
        echo "2. Monitor 50-100 posts for 24-48 hours"
        echo "3. Verify FORCE_SHOW_ORIGIN_POSTURL behavior"
        echo "4. Verify whitespace handling in RSS feeds"
        echo "5. Proceed to production if no issues found"
        echo ""
    else
        print_header "Test Results: FAILURE"
        print_error "Some tests failed!"
        echo ""
        print_warning "DO NOT deploy to production"
        echo ""
        print_subheader "Troubleshooting Steps"
        echo "1. Review the test output above for details"
        echo "2. Check TEST_REPORT_v3_1_2.md for expected behavior"
        echo "3. Compare with BUG_FIXES_VISUAL_COMPARISON.md"
        echo "4. Fix the issues in the v3.1.2 script"
        echo "5. Re-run tests until all pass"
        echo ""
    fi
    
    # Documentation links
    print_subheader "Documentation"
    echo "📄 README_TESTING_PACKAGE.md  - Complete overview"
    echo "📄 TESTING_QUICK_START.md     - Quick reference"
    echo "📄 TEST_REPORT_v3_1_2.md      - Detailed test report"
    echo "📄 BUG_FIXES_VISUAL_COMPARISON.md - Before/after comparison"
    echo ""
    
    exit $TEST_EXIT_CODE
}

# Run main function
main
